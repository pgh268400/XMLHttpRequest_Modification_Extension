console.log("script run start");

// 특정 url 주소와 status 코드에 대해서만 응답값을 변조하도록 설정
const filter = [
  {
    target: "api",
    mode: "include",
    status: [0],
  },
  // {
  //   target: "api2",
  //   mode: "same",
  //   status: [402, 204, 201],
  // },
];

// 필터링 조건이 맞는지 확인하는 함수
function apply_filter_test(url, xml_status, filter) {
  if (!(filter && filter.length > 0)) return false; // 필터가 없으면 변조 필터링이 적용되지 않아야 함
  for (const item of filter) {
    const { target, mode, status: filterStatus } = item;

    if (mode === "include" && url.includes(target)) {
      // include 모드인 경우 url이 target을 포함하는 경우에만 필터링합니다.
      if (filterStatus.includes(xml_status)) {
        return true; // 변조 필터링이 적용되어야 함
      }
    } else if (mode === "same" && url === target) {
      // same 모드인 경우 url이 target과 같은 경우에만 필터링합니다.
      if (filterStatus.includes(xml_status)) {
        return true; // 변조 필터링이 적용되어야 함
      }
    }
  }
  return false; // 변조 필터링이 적용되지 않아야 함
}

var _open = XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, url) {
  var _onreadystatechange = this.onreadystatechange,
    _this = this;

  _this.onreadystatechange = function () {
    try {
      console.log("Caught! :)", method, url /*, _this.responseText*/);
      console.log("ready_status", _this.readyState, "status", _this.status);
    } catch (e) {}

    // 요청이 완료된 경우에만 변조하도록 함 (readyState: 4)
    if (
      _this.readyState === 4 &&
      apply_filter_test(url, _this.status, filter)
    ) {
      try {
        //////////////////////////////////////
        // 이곳에 응답값 변조 로직을 작성합니다.
        //////////////////////////////////////
        console.log("응답값 변조 시작");
        console.log(_this);

        // 여기서 responseText (응답 데이터) 와 status (응답 코드) 를 변조합니다.
        Object.defineProperty(_this, "responseText", {
          value: "password-correct",
        });

        Object.defineProperty(_this, "status", {
          value: 200,
        });

        /////////////// 종료 //////////////////
      } catch (e) {}
    }
    // call original callback
    if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
  };

  // detect any onreadystatechange changing
  Object.defineProperty(this, "onreadystatechange", {
    get: function () {
      return _onreadystatechange;
    },
    set: function (value) {
      _onreadystatechange = value;
    },
  });

  return _open.apply(_this, arguments);
};
