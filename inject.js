// 크롬에서 content script 들은 DOM 과는 동기화 되어 있어서 DOM에는 바로 접근이 가능하지만.
// 변수는 동기화 되어 있지 않기 때문에 페이지의 window 변수 같은것에 접근할 수 없음.
// 접근을 위해 일종의 꼼수 사용. 페이지에 script 태그로써 삽입하여 window 변수나 페이지 내의 변수를 접근할 수 있게 한다.

function inject_script(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
}

//body 태그의 자식으로써 js를 삽입한다.
inject_script(chrome.runtime.getURL("proxy.js"), "body");
