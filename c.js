window.SINGLE_TAB = "  ";
window.ImgCollapsed = "./Collapsed.gif";
window.ImgExpanded = "./Expanded.gif";
window.QuoteKeys = true;

function $id(id) {
  return document.getElementById(id);
}

function IsArray(obj) {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.length === 'number' &&
    !(obj.propertyIsEnumerable('length'));
}

function Process() {
  SetTab();
  window.IsCollapsible = $id("CollapsibleView").checked;
  var json = $id("RawJson").value;
  var html = "";
  try {
    if (json == "") {
      json = "\"\"";
      return;
    }
    var obj = eval("[" + json + "]");
    html = ProcessObject(obj[0], 0, false, false, false);
    $id("Canvas").innerHTML = "<PRE class='CodeContainer'>" + html + "</PRE>";
  } catch (e) {
    alert("JSON数据格式不正确:\n" + e.message);
    $id("Canvas").innerHTML = "";
  }
}
window._dateObj = new Date();
window._regexpObj = new RegExp();

function ProcessObject(obj, indent, addComma, isArray, isPropertyContent) {
  var html = "";
  var comma = (addComma) ? "<span class='comma'>,</span> " : "";
  var type = typeof obj;
  var clpsHtml = "";
  if (IsArray(obj)) {
    if (obj.length == 0) {
      html += GetRow(indent, "<span class='arr'>[ ]</span>" + comma, isPropertyContent);
    } else {
      clpsHtml = window.IsCollapsible ? "<span><img src=\"" + window.ImgExpanded + "\" onClick=\"ExpImg(this)\" /></span><span class='coll'>" : "";
      html += GetRow(indent, "<span class='arr'>[</span>" + clpsHtml, isPropertyContent);
      for (var i = 0; i < obj.length; i++) {
        html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
      }
      clpsHtml = window.IsCollapsible ? "</span>" : "";
      html += GetRow(indent, clpsHtml + "<span class='arr'>]</span>" + comma);
    }
  } else if (type == 'object') {
    if (obj == null) {
      html += FormatLiteral("null", "", comma, indent, isArray, "null");
    } else if (obj.constructor == window._dateObj.constructor) {
      html += FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString() + "*/", "", comma, indent, isArray, "Date");
    } else if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
    } else {
      var numProps = 0;
      for (var prop in obj) numProps++;
      if (numProps == 0) {
        html += GetRow(indent, "<span class='brace'>{ }</span>" + comma, isPropertyContent);
      } else {
        clpsHtml = window.IsCollapsible ? "<span><img src=\"" + window.ImgExpanded + "\" onClick=\"ExpImg(this)\" /></span><span class='coll'>" : "";
        html += GetRow(indent, "<span class='brace'>{</span>" + clpsHtml, isPropertyContent);
        var j = 0;
        for (var prop in obj) {
          var quote = window.QuoteKeys ? "\"" : "";
          html += GetRow(indent + 1, "<span class='key'>" + quote + prop + quote + "</span>: " + ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));
        }
        clpsHtml = window.IsCollapsible ? "</span>" : "";
        html += GetRow(indent, clpsHtml + "<span class='brace'>}</span>" + comma);
      }
    }
  } else if (type == 'number') {
    html += FormatLiteral(obj, "", comma, indent, isArray, "num");
  } else if (type == 'boolean') {
    html += FormatLiteral(obj, "", comma, indent, isArray, "bool");
  } else if (type == 'function') {
    if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
    } else {
      obj = FormatFunction(indent, obj);
      html += FormatLiteral(obj, "", comma, indent, isArray, "fun");
    }
  } else if (type == 'undefined') {
    html += FormatLiteral("undefined", "", comma, indent, isArray, "null");
  } else {
    html += FormatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "str");
  }
  return html;
}

function FormatLiteral(literal, quote, comma, indent, isArray, style) {
  if (typeof literal == 'string')
    literal = literal.split("<").join("&lt;").split(">").join("&gt;");
  var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
  if (isArray) str = GetRow(indent, str);
  return str;
}

function FormatFunction(indent, obj) {
  var tabs = "";
  for (var i = 0; i < indent; i++) tabs += window.TAB;
  var funcStrArray = obj.toString().split("\n");
  var str = "";
  for (var i = 0; i < funcStrArray.length; i++) {
    str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
  }
  return str;
}

function GetRow(indent, data, isPropertyContent) {
  var tabs = "";
  for (var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB;
  if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n")
    data = data + "\n";
  return tabs + data;
}

function CollapsibleViewClicked() {
  $id("CollapsibleViewDetail").style.visibility = $id("CollapsibleView").checked ? "visible" : "hidden";
  Process();
}

function QuoteKeysClicked() {
  window.QuoteKeys = $id("QuoteKeys").checked;
  Process();
}

function CollapseAllClicked() {
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element) {
    if (element.className == 'coll') {
      MakeContentVisible(element, false);
    }
  }, 0);
}

function ExpandAllClicked() {
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element) {
    if (element.className == 'coll') {
      MakeContentVisible(element, true);
    }
  }, 0);
}

function MakeContentVisible(element, visible) {
  var img = element.previousSibling.firstChild;
  if (!!img.tagName && img.tagName.toLowerCase() == "img") {
    element.style.display = visible ? 'inline' : 'none';
    element.previousSibling.firstChild.src = visible ? window.ImgExpanded : window.ImgCollapsed;
    // add by zollty, show item count number
    if (!visible) {
      var cc = 0;
      for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == 'key') {
          cc++;
          //console.log(element.childNodes[i].innerHTML);
        }
      }
      // console.log("key=: " + cc);
      if (cc == 0) {
        for (var i = 0; i < element.childNodes.length; i++) {
          //console.log(element.childNodes[i].className);
          if (element.childNodes[i].className == 'coll' ||
            element.childNodes[i].className == 'str' ||
            element.childNodes[i].className == 'num' ||
            element.childNodes[i].className == 'bool' ||
            element.childNodes[i].className == 'null') {
            cc++;
            //console.log(element.childNodes[i].innerHTML);
          }
        }
      }
      var title = '包含 ' + cc + ' 项';
      //var newItem = document.createElement("SPAN");
      //var textnode = document.createTextNode(cc);
      //newItem.appendChild(textnode);
      //newItem.className = 'count';
      //newItem.title = title;
      //element.parentNode.insertBefore(newItem, element.nextSibling);

      //element.previousSibling.mtitle = title;
      //element.previousSibling.setAttribute('onmouseover', 'titleMouseOver(this,event);');
      //element.previousSibling.setAttribute('onmouseout', 'titleMouseOut(this);');
      element.previousSibling.title = title;
    }
  }
}

function TraverseChildren(element, func, depth) {
  for (var i = 0; i < element.childNodes.length; i++) {
    TraverseChildren(element.childNodes[i], func, depth + 1);
  }
  func(element, depth);
}

function ExpImg(img) {
  var container = img.parentNode.nextSibling;
  if (!container) return;
  var disp = "none";
  var src = window.ImgCollapsed;
  if (container.style.display == "none") {
    disp = "inline";
    src = window.ImgExpanded;
  }
  container.style.display = disp;
  img.src = src;
}

function CollapseLevel(level) {
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element, depth) {
    if (element.className == 'coll') {
      if (depth >= level) {
        MakeContentVisible(element, false);
      } else {
        MakeContentVisible(element, true);
      }
    }
  }, 0);
}

function TabSizeChanged() {
  Process();
}

function SetTab() {
  var select = $id("TabSize");
  window.TAB = MultiplyString(parseInt(select.options[select.selectedIndex].value), window.SINGLE_TAB);
}

function EnsureIsPopulated() {
  if (!$id("Canvas").innerHTML && !!$id("RawJson").value) Process();
}

function MultiplyString(num, str) {
  var sb = [];
  for (var i = 0; i < num; i++) {
    sb.push(str);
  }
  return sb.join("");
}