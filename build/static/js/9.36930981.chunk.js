(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[9],{357:function(e,t,a){},558:function(e,t,a){"use strict";a.r(t);var n=a(12),s=a(13),o=a(21),c=a(20),r=a(0),i=a.n(r),l=(a(95),a(357),a(33)),u=a(1),d=a(79),m=function(e){Object(o.a)(a,e);var t=Object(c.a)(a);function a(e){var s;return Object(n.a)(this,a),(s=t.call(this,e)).state={key:"uplay",text:""},s}return Object(s.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.setLayout),window.addEventListener("load",this.setLayout),this.setLayout()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.setLayout),window.addEventListener("load",this.setLayout)}},{key:"setLayout",value:function(){var e,t=document.querySelector(".background-video"),a=document.querySelector("#background-video-content"),n=window.innerHeight/900,s=window.innerWidth/1560;e=s<=n?n:s,t&&a&&(a.style.transform="translate3d(-50%,-50%,0) scale(".concat(e,")"))}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"landing-container"},i.a.createElement("div",{className:"background-video",style:{}},i.a.createElement("video",{id:"background-video-content",style:{},muted:!0,autoPlay:!0,loop:!0,preload:"auto",src:"season18.mp4"})),i.a.createElement("div",{className:"black-layer"}),i.a.createElement("div",{className:"search-container"},i.a.createElement("div",{className:"search-items",style:{lineHeight:1.5}},i.a.createElement("div",{className:"sub-header white-text"},"\uc2dc\uc98c 18 : Operation Steel Wave"),i.a.createElement("div",{className:"sub-sub-header white-text "},"\ub0b4 \uacc4\uc815\uc758 \ucd5c\uadfc \uc804\uc801\uc744 \ud655\uc778\ud558\uc138\uc694"),i.a.createElement("div",{className:"input-container"},i.a.createElement(d.a,{className:"icons",value:this.state.key,onChange:function(t){e.setState({key:t})}},i.a.createElement(l.a,{value:"uplay"}),i.a.createElement(l.a,{value:"psn"}),i.a.createElement(l.a,{value:"xbl"})),i.a.createElement("input",{placeholder:"\uc544\uc774\ub514\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694",value:this.state.text,onChange:function(t){e.setState({text:t.currentTarget.value})},onKeyDown:function(t){13===t.keyCode&&e.props.history.push("/search/overview/query?platform=".concat(e.state.key,"&username=").concat(e.state.text))}}),i.a.createElement("button",{onClick:function(){e.props.history.push("/search/"+e.state.text)}}," Search ")))))}}]),a}(i.a.Component);t.default=Object(u.f)(m)}}]);
//# sourceMappingURL=9.36930981.chunk.js.map