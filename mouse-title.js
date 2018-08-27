/**
 * JS字符切割函数
 * @params     string                原字符串
 * @params    words_per_line        每行显示的字符数
 */
function split_str(string, words_per_line) {
  //空串，直接返回
  if (typeof string == 'undefined' || string.length == 0) return '';
  //单行字数未设定，非数值，则取默认值50
  if (typeof words_per_line == 'undefined' || isNaN(words_per_line)) {
    words_per_line = 50;
  }
  //格式化成整形值
  words_per_line = parseInt(words_per_line);
  //取出i=0时的字，避免for循环里换行时多次判断i是否为0
  var output_string = string.substring(0, 1);
  //循环分隔字符串
  for (var i = 1; i < string.length; i++) {
    //如果当前字符是每行显示的字符数的倍数，输出换行
    if (i % words_per_line == 0) {
      output_string += "<br/>";
    }
    //每次拼入一个字符
    output_string += string.substring(i, i + 1);
  }
  return output_string;
}

/**
 * 鼠标悬停显示TITLE
 * @params     obj        当前悬停的标签
 */
function titleMouseOver(obj, event, words_per_line) {
  //无TITLE悬停，直接返回
  if (typeof obj.mtitle == 'undefined' || obj.mtitle == '') return false;
  //不存在title_show标签则自动新建
  var title_show = document.getElementById("title_show");
  if (title_show == null) {
    title_show = document.createElement("div"); //新建Element
    document.getElementsByTagName('body')[0].appendChild(title_show); //加入body中
    var attr_id = document.createAttribute('id'); //新建Element的id属性
    attr_id.nodeValue = 'title_show'; //为id属性赋值
    title_show.setAttributeNode(attr_id); //为Element设置id属性

    var attr_style = document.createAttribute('style'); //新建Element的style属性
    attr_style.nodeValue = 'position:absolute;' //绝对定位
      + 'border:solid 1px #999999; background:#EDEEF0;' //边框、背景颜色
      + 'border-radius:2px;box-shadow:2px 3px #999999;' //圆角、阴影
      + 'line-height:18px;' //行间距
      + 'font-size:12px; padding: 2px 5px;'; //字体大小、内间距
    try {
      title_show.setAttributeNode(attr_style); //为Element设置style属性
    } catch (e) {
      //IE6
      title_show.style.position = 'absolute';
      title_show.style.border = 'solid 1px #999999';
      title_show.style.background = '#EDEEF0';
      title_show.style.lineHeight = '18px';
      title_show.style.fontSize = '18px';
      title_show.style.padding = '2px 5px';
    }
  }
  //存储并删除原TITLE
  document.title_value = obj.mtitle;
  obj.mtitle = '';
  //单行字数未设定，非数值，则取默认值50
  if (typeof words_per_line == 'undefined' || isNaN(words_per_line)) {
    words_per_line = 50;
  }
  //格式化成整形值
  words_per_line = parseInt(words_per_line);
  //在title_show中按每行限定字数显示标题内容，模拟TITLE悬停效果
  title_show.innerHTML = split_str(document.title_value, words_per_line);
  //显示悬停效果DIV
  title_show.style.display = 'block';

  //根据鼠标位置设定悬停效果DIV位置
  event = event || window.event; //鼠标、键盘事件
  var top_down = 15; //下移15px避免遮盖当前标签
  //最左值为当前鼠标位置 与 body宽度减去悬停效果DIV宽度的最小值，否则将右端导致遮盖
  var left = Math.min(event.clientX, document.body.clientWidth - title_show.clientWidth);
  title_show.style.left = left + "px"; //设置title_show在页面中的X轴位置。
  title_show.style.top = (event.clientY + top_down) + "px"; //设置title_show在页面中的Y轴位置。
}
/**
 * 鼠标离开隐藏TITLE
 * @params    obj        当前悬停的标签
 */
function titleMouseOut(obj) {
  var title_show = document.getElementById("title_show");
  //不存在悬停效果，直接返回
  if (title_show == null) return false;
  //存在悬停效果，恢复原TITLE
  obj.mtitle = document.title_value;
  //隐藏悬停效果DIV
  title_show.style.display = "none";
}
