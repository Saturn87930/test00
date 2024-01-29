
L.LocShare = {}
var LS = L.LocShare
LS.Send = {}
LS.Send.Marker = {}
LS.Send.Popup = L.popup().setContent('<div><input id="sendText" type="text" style="border-color:#a7a7a7;border:solid;border-width:2px;border-radius:5px;height:30px;" size="30" onkeyup="L.LocShare.Send.UpdateMessage( this )" placeholder="请输入您的分享寄语"/></div><div style="height:35px;"><button style="border-style:solid;border-radius:5px;border-color:#3d94f6;float:right;color:white;background-color:#3d94f6;height:35px;font-size:15px;line-height:3px;margin:5px;" onclick="copyPrompt()">分享当前视角</button></div></div>')
LS.Receive = {}
LS.Receive.Marker = {}
LS.Receive.Popup = L.popup()
var sendIcon = L.icon({
  iconUrl: "https://jsd.onmicrosoft.cn/gh/Saturn87930/test00/leaflet/images/IconMapSend.png",
  iconSize:     [24, 24], // size of the icon
  iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
})

receiveIcon = L.icon({
  iconUrl: "https://jsd.onmicrosoft.cn/gh/Saturn87930/test00/leaflet/images/IconMapReceive.png",
  iconSize:     [24, 24], // size of the icon
  iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
})

L.Map.addInitHook(function () {
  setTimeout(() => {
    this.sharelocationControl = new L.Control.ShareLocation();
    this.addControl(this.sharelocationControl);
    this.whenReady( function(){
      populateMarker(this);
    })
  })
});

L.Control.ShareLocation = L.Control.extend({
    options: {
        position: 'topleft', // 将这里的 'topleft' 更改为 'topleft-third'
        title: '视角分享'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control'); // 添加一个新的CSS类 custom-topleft-third

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
        this.link.title = this.options.title;
        var userIcon = L.DomUtil.create('img', 'img-responsive', this.link);
        userIcon.src = 'https://jsd.onmicrosoft.cn/gh/Saturn87930/test00/leaflet/images/IconLocShare.gif';
        userIcon.alt = '';
        userIcon.setAttribute('role', 'presentation');
        this.link.href = '#';
        this.link.setAttribute('role', 'button');

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        placeMarker(this._map);
    },
});




// //这里下面写的是接收分享后使用透明图标
// function populateMarker(selectedMap) {
//   // 替换下面的行以获取任何 Url 解析器的结果
//   var intermediate = getJsonFromUrl();
//   if (isFinite(intermediate.lat) && isFinite(intermediate.lng) && isFinite(intermediate.zoom)) {
//     LS.Receive.message = intermediate.M;
//     LS.Receive.lat = +intermediate.lat;
//     console.log(intermediate.lat);
//     LS.Receive.lng = +intermediate.lng;
//     console.log(intermediate.lng);
//     LS.Receive.zoom = +intermediate.zoom;
//     console.log(intermediate.zoom);

//     // 创建透明图标
//     var transparentIcon = L.divIcon({ className: 'leaflet-transparent-icon' });
    
//     // 创建标记，使用透明图标
//     LS.Receive.Marker = L.marker([LS.Receive.lat, LS.Receive.lng], { icon: transparentIcon });
//     LS.Receive.Marker.addTo(selectedMap);

//     // 设置地图视图，根据链接中的 zoom 级别
//     selectedMap.setView([LS.Receive.lat, LS.Receive.lng], LS.Receive.zoom);

//     // 自动弹出寄语
//     LS.Receive.Marker.bindPopup(LS.Receive.message).openPopup();
//   }
// }




//这里下面写的是接收分享后使用receiveIcon图标
function populateMarker(selectedMap) {
  // 替换下面的行以获取任何 Url 解析器的结果
  var intermediate = getJsonFromUrl();
  if (isFinite(intermediate.lat) && isFinite(intermediate.lng) && isFinite(intermediate.zoom)) {
    LS.Receive.message = intermediate.M;
    LS.Receive.lat = +intermediate.lat;
    console.log(intermediate.lat);
    LS.Receive.lng = +intermediate.lng;
    console.log(intermediate.lng);
    LS.Receive.zoom = +intermediate.zoom;
    console.log(intermediate.zoom);

    // 创建标记，使用默认图标
    LS.Receive.Marker = L.marker( [ LS.Receive.lat , LS.Receive.lng] , {icon:receiveIcon})
    LS.Receive.Marker.addTo(selectedMap);

    // 设置地图视图，根据链接中的 zoom 级别
    selectedMap.setView([LS.Receive.lat, LS.Receive.lng], LS.Receive.zoom);

    // 自动弹出寄语
    LS.Receive.Marker.bindPopup(LS.Receive.message).openPopup();
  }
}




function getJsonFromUrl () {
  var params = {}
  params.query = location.search.substr(1);
  params.parsed = decodeURIComponent( params.query )
  params.data = params.parsed.split("&");
  params.result = {};
  for(var i=0; i<params.data.length; i++) {
    var item = params.data[i].split("=");
    params.result[item[0]] = item[1];
  }
  // This will return all of the data in the query parameters in object form
  // getJsonFromUrl() only splits on ampersand and equals -- jquery can do better
  // But so could you!! submit a pull request if you've got one!
  return params.result;
}




var shareLink; // 将shareLink定义为全局变量



// 在这里定义 showSuccessModal 函数
function showSuccessModal(shareLink) {
  // 创建模态框元素
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 9999; border-radius: 10px;';

  // 创建内容元素
  var content = document.createElement('div');
  content.innerHTML = '<strong style="color: red;">已复制到剪贴板，待分享</strong>';

  // 将内容添加到模态框中
  modal.appendChild(content);

  // 将模态框添加到页面中
  document.body.appendChild(modal);


  // 一定时间后移除模态框
  setTimeout(function() {
    document.body.removeChild(modal);
  }, 4000); // 3秒后移除模态框，可以根据需要调整时间

}


function copyPrompt() {
  // 更新地图的当前缩放级别和坐标
  var currentZoom = LS.Send.Marker._map.getZoom();
  LS.Send.lat = LS.Send.Marker.getLatLng().lat;
  LS.Send.lng = LS.Send.Marker.getLatLng().lng;

  // 构建分享链接，包含当前的经纬度、缩放级别和寄语
  shareLink =
    location.origin +
    location.pathname +
    '?' +
    'lat' +
    '=' +
    LS.Send.lat +
    '&' +
    'lng' +
    '=' +
    LS.Send.lng +
    '&' +
    'zoom' +
    '=' +
    currentZoom +
    '&' +
    'M' +
    '=' +
    LS.Send.Message;

    console.log('shareLink:', shareLink); // 添加这行

  // 使用 Clipboard API 复制到剪贴板
  navigator.clipboard.writeText(shareLink)
    .then(function() {
      // 复制成功后关闭弹窗
      closePopupAndShowSuccessModal();
    })
    .catch(function(err) {
      // 复制失败
      console.error('无法复制到剪贴板', err);
    });
}

function closePopupAndShowSuccessModal() {
  // 判断 Marker 是否存在
  if (LS.Send.Marker) {
    // 关闭 Marker 关联的 Popup
    LS.Send.Marker.closePopup();

    // 调用显示成功模态框的逻辑
    showSuccessModal(shareLink);
  }
}






function placeMarker( selectedMap ){
//  var test = LS.Send.Marker._latlng
//  if ( isFinite(test.lat) && isFinite(test.lng) ){
    if (!LS.Send.Marker._latlng ) {
      console.log('if (!LS.Send.Marker._latlng ) { passed!  line 95')
      LS.Send.Marker = L.marker( selectedMap.getCenter() , {draggable: true,icon: sendIcon} );
      setSendValues( selectedMap.getCenter() )
      LS.Send.Marker.on('dragend', function(event) {
        setSendValues( event.target.getLatLng());
        LS.Send.Marker.openPopup();
      });
      LS.Send.Marker.bindPopup(LS.Send.Popup);
      LS.Send.Marker.addTo(selectedMap);
    } else {
      LS.Send.Marker.setLatLng( selectedMap.getCenter() )
    }
    //selectedMap.setView( location , 16 )
    LS.Send.Marker.openPopup();
//  }
};

LS.Send.UpdateMessage = function( text ){
  var encodedForUrl = encodeURIComponent( text.value );
  LS.Send.Message = encodedForUrl
}

function setSendValues( result ){
  LS.Send.lat = result.lat;
  LS.Send.lng = result.lng; 
}
  
