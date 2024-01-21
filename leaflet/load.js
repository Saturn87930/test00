//初始化地图
$(document).ready(function () {
    var map = L.map("map", {
        attributionControl: false,
        center: [39.9, 116.4],   //北京
        // center: [23.563987, 121.025391],   //台湾省
        // center: [24.837929449862603, 55.40449261665345],   //爱湖
        zoom: 12,
        minZoom: 2,
        // maxZoom: 18,
        zoomControl:false,
        measureControl: true,
    });

    L.control.coordinates({position: 'bottomleft'}).addTo(map);   //添加左上角坐标（可自定义输入坐标）


    //天地图相关数据
    var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {}),
        normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {}),
        imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {}),
        imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {});
    var normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);
    var baseLayers = {
        "地图": normal,
        "影像": image,
    }


    //Geoq相关数据
    var normalm1 = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm2 = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm3 = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm4 = L.tileLayer.chinaProvider('Geoq.Normal.Warm', {
        maxZoom: 18,
        minZoom: 5
    });
    var normalm5 = L.tileLayer.chinaProvider('Geoq.Theme.Hydro', {
        maxZoom: 18,
        minZoom: 5
    });
    var normal = L.layerGroup([normalm1, normalm2, normalm3, normalm4, normalm5]);

    var baseLayers = {
        "地图": normalm1,
        "午夜蓝": normalm2,
        "灰色": normalm3,
        "暖色": normalm4,
        "水系": normalm5
    }



    //控制地图底图
    var baseLayers = {
        '太空夜景(需缩小)': L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
            bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
            minZoom: 1,
            maxZoom: 8,
            format: 'jpg',
            time: '',
            tilematrixset: 'GoogleMapsCompatible_Level'
        }),
        Google地图: L.tileLayer.chinaProvider('Google.Normal.Map'),
        Google影像: L.tileLayer.chinaProvider('Google.Satellite.Map'),
        Google标注: L.tileLayer.chinaProvider('Google.Satellite.Annotion').addTo(map),

        高德地图: L.tileLayer.chinaProvider('GaoDe.Normal.Map'),
        高德影像: L.tileLayer.chinaProvider('GaoDe.Satellite.Map'),
        高德标注: L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion'),                

        腾讯地图: L.tileLayer.chinaProvider('Tencent.Normal.Map', {maxZoom: 18, minZoom: 5, }),
        腾讯影像: L.tileLayer.chinaProvider('Tencent.Satellite.Map', {maxZoom: 18, minZoom: 5, }),
        腾讯地形: L.tileLayer.chinaProvider('Tencent.Terrain.Map', {maxZoom: 15, minZoom: 5, }),


        天地图: normal,
        天地图影像: image,

        "GeoQ 地图": normalm1,
        "GeoQ 午夜蓝": normalm2,
        "GeoQ 灰色": normalm3,
        "GeoQ 暖色": normalm4,
        "GeoQ 水系": normalm5

        // OSM地图: L.tileLayer(
        //     "//{s}.tile.osm.org/{z}/{x}/{y}.png",
        //     { subdomains: ['a', 'b', 'c'] }
        // ),

    };




    // var miniMap = new L.Control.GlobeMiniMap({      //添加转动小地球
    //   // uncomment to assign colors
    //   land: "#94cf6a",
    //   water: "#3972f7",
    //   // land: "#94cf6a",
    //   // water: "#3972f7",
    //   // marker: "#e44131",
    //   topojsonSrc : 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/src/world.json',
    // }).addTo(map);



    L.control.layers(baseLayers, {}, { position: "topleft" }).addTo(map);   //图层选择按钮


    //自动定位插件
    L.geolet({
        position: 'topleft' ,
        geoOptions: { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 },
        title: '自动定位',
        autoPan: true,
    }).addTo(map);

    // 添加搜索框
    map.addControl( new L.Control.Search({    
        url: 'https://map.navnav.top/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat','lon'],
        // marker: L.circleMarker([0,0],{radius:30}),
        marker: {icon: true, animate: false},
        autoCollapse: true,
        autoType: false,
        minLength: 2
    }) );

    //添加比例尺
    var scale = L.control.scale({ imperial: false, metric: true, position: 'bottomright',});   
    map.addControl(scale);
    // 请确保：metric: true（默认）
    // scale._mScale.innerText = `${scale._mScale.innerText.slice(0, -2)} ${scale._mScale.innerText.slice(-2) ==='km'? '公里': '米'}`
    // 请确保：imperial: true（默认）
    // scale.getContainer().childNodes[1].innerText = `${scale.getContainer().childNodes[1].innerText.slice(0, -2)} ${scale.getContainer().childNodes[1].innerText.slice(-2) ==='mi'? '英里': '英尺'}`


    // 创建空间站实时坐标插件
    L.Control.ISSLocator = L.Control.extend({
        options: {
            position: 'topleft',  // 设置插件在左上角
            title: '空间站实时坐标',
        },
        onAdd: function (map) {
            // 创建按钮
            // var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom iss-locator-button'); // 使用div代替button元素
            var container = L.DomUtil.create('div', 'leaflet-control iss-locator-button'); // 使用div代替button元素
            this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
            this.link.title = this.options.title;

            // 创建图标元素
            var icon = L.DomUtil.create('img', 'icon-image');
            icon.src = 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/iss.png'; // 替换为你本地 PNG 图片的路径
            icon.alt = '空间站坐标';
            icon.title = '空间站实时坐标'

            // 按钮点击事件
            container.onclick = function () {
                // 获取ISS位置
                fetchISSLocation();
            };

            // 将图标添加到按钮中
            container.appendChild(icon);

            return container;
        },
    });

    L.control.issLocator = function (opts) {
        return new L.Control.ISSLocator(opts);
    }

    L.control.issLocator().addTo(map);


    var issMarker; // 先声明issMarker变量


    // 获取ISS位置并在地图上显示
    function fetchISSLocation() {
        // 使用API获取ISS位置数据
        fetch('https://wheretheiss.navnav.top/v1/satellites/25544')
            .then(response => response.json())
            .then(data => {
                // 获取经纬度
                var lat = data.latitude;
                var lon = data.longitude;

                // 跳转到ISS位置
                map.setView([lat, lon], 3);

                // 在地图上添加ISS图标
                var issIcon = L.icon({
                    iconUrl: 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/iss2.png',
                    iconSize: [48, 48],
                    iconAnchor: [24, 24],
                });

                // 检查是否已经有之前的标记
                if (issMarker) {
                    map.removeLayer(issMarker); // 如果有，先移除之前的标记
                }

                // 添加新的ISS标记
                issMarker = L.marker([lat, lon], { icon: issIcon })
                    .bindPopup('空间站实时坐标：' + '纬度:' + lat.toFixed(2) + ', ' + '经度:' + lon.toFixed(2))
                    .addTo(map)
                    .openPopup();
            })
            .catch(error => console.error('获取 ISS 位置时发生错误:', error));
    }



    // 创建iconce插件（图标分享网站链接）
    L.Control.Iconce = L.Control.extend({  
        options: {  
            position: 'topright',  // 设置插件在左上角  
            title: '图标分享',  
        },  
      
        onAdd: function (map) {  
            // 创建按钮容器  
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');  
      
            // 创建链接元素并设置为按钮  
            var link = L.DomUtil.create('a', 'leaflet-control-iconce', container);  
            link.href = '#'; // 通常需要为链接设置一个 href，即使我们不打算用它  
            link.title = this.options.title;  
      
            // 创建图标元素并添加到链接中  
            var icon = L.DomUtil.create('img', '', link); // 第二个参数是CSS类，如果不需要可以不传  
            icon.src = 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/ce.png'; // 确保图片路径正确  
            icon.alt = '图标分享';  
      
            // 按钮点击事件  
            L.DomEvent.on(link, 'click', L.DomEvent.stopPropagation)  
                      .on(link, 'click', L.DomEvent.preventDefault)  
                      .on(link, 'click', function () {  
                          // 打开新窗口或标签页  
                          window.open('https://iconce.com/', '_blank');  
                      });  
      
            // 将链接（按钮）添加到容器中  
            // 注意：在上一步，我们已经将图标添加到链接中了  
      
            // 使得容器（也就是按钮）可以被点击  
            L.DomEvent.disableClickPropagation(container);  
      
            return container;  
        },  
    });  
      
      
    // 创建并添加自定义控件实例  
    var iconceControl = new L.Control.Iconce();  
    map.addControl(iconceControl);


    // L.marker([39.905530,116.391305]).addTo(map).bindPopup('<p>我是WGS84坐标下，天安门广场国旗所在位置</p>').openPopup();


    // 创建跳转百度地图菜单栏控件  
    var menuBar = L.control({position: 'bottomleft'}); // 设置位置为左下角  
    menuBar.onAdd = function () {    
        var div = L.DomUtil.create('div', 'menuBar');    
        var img = L.DomUtil.create('img', 'menuIcon', div);  // 创建图标元素  
        img.src = 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/baidu.png'; // 替换为您的图标URL  
        img.alt = '百度地图'; // 可选的，为屏幕阅读器提供信息
        img.title = '切换百度地图';  
        img.onclick = function () { showBaiduMap(); };  // 设置点击事件处理程序  
        return div;    
    }; 
    menuBar.addTo(map); // 将控件添加到地图上  


});




//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
//添加百度地图
var bdmap = L.map('bdmap', {
    crs: L.CRS.Baidu,
    attributionControl: false,
    center: [39.9, 116.4],   //北京
    // center: [23.563987, 121.025391],   //台湾省
    // center: [24.837929449862603, 55.40449261665345],   //爱湖
    zoom: 12,
    minZoom: 6,
    // maxZoom: 18,
    zoomControl:false,
    measureControl: true,
    // layers:[]
});

L.control.coordinates({position: 'bottomleft'}).addTo(bdmap);   //添加左上角坐标（可自定义输入坐标）



var normalMap = L.tileLayer.chinaProvider('Baidu.Normal.Map', {
        maxZoom: 19,
        minZoom: 5
    }),
    satelliteMap = L.tileLayer.chinaProvider('Baidu.Satellite.Map', {
        maxZoom: 19,
        minZoom: 5
    }),
    annotionMap = L.tileLayer.chinaProvider('Baidu.Satellite.Annotion', {
        maxZoom: 19,
        minZoom: 5
    });

var baseLayers = {
    "百度地图": normalMap,
    "百度影像": satelliteMap
}

var overlayLayers = {
    "百度标注": annotionMap
}


// var baiduMap = L.tileLayer.chinaProvider('Baidu.Satellite.Map').addTo(bdmap);
var baiduMap = satelliteMap.addTo(bdmap);
L.control.layers(baseLayers, overlayLayers, { position: "topleft" }).addTo(bdmap);


//自动定位插件
L.geolet({
    position: 'topleft' ,
    geoOptions: { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 },
    title: '自动定位',
    autoPan: true,
}).addTo(bdmap);

// 添加搜索框
bdmap.addControl( new L.Control.Search({    
    url: 'https://map.navnav.top/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat','lon'],
    // marker: L.circleMarker([0,0],{radius:30}),
    marker: {icon: true, animate: false},
    autoCollapse: true,
    autoType: false,
    minLength: 2
}) );

//添加比例尺
var scale = L.control.scale({ imperial: false, metric: true, position: 'bottomright' });   
bdmap.addControl(scale);
// 请确保：metric: true（默认）
// scale._mScale.innerText = `${scale._mScale.innerText.slice(0, -2)} ${scale._mScale.innerText.slice(-2) ==='km'? '公里': '米'}`
// 请确保：imperial: true（默认）
// scale.getContainer().childNodes[1].innerText = `${scale.getContainer().childNodes[1].innerText.slice(0, -2)} ${scale.getContainer().childNodes[1].innerText.slice(-2) ==='mi'? '英里': '英尺'}`



// 创建iconce插件（图标分享网站链接）
L.Control.Iconce = L.Control.extend({  
    options: {  
        position: 'topright',  // 设置插件在左上角  
        title: '图标分享',  
    },  
  
    onAdd: function (map) {  
        // 创建按钮容器  
        var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');  
  
        // 创建链接元素并设置为按钮  
        var link = L.DomUtil.create('a', 'leaflet-control-iconce', container);  
        link.href = '#'; // 通常需要为链接设置一个 href，即使我们不打算用它  
        link.title = this.options.title;  
  
        // 创建图标元素并添加到链接中  
        var icon = L.DomUtil.create('img', '', link); // 第二个参数是CSS类，如果不需要可以不传  
        icon.src = 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/ce.png'; // 确保图片路径正确  
        icon.alt = '图标分享';  
  
        // 按钮点击事件  
        L.DomEvent.on(link, 'click', L.DomEvent.stopPropagation)  
                  .on(link, 'click', L.DomEvent.preventDefault)  
                  .on(link, 'click', function () {  
                      // 打开新窗口或标签页  
                      window.open('https://iconce.com/', '_blank');  
                  });  
  
        // 将链接（按钮）添加到容器中  
        // 注意：在上一步，我们已经将图标添加到链接中了  
  
        // 使得容器（也就是按钮）可以被点击  
        L.DomEvent.disableClickPropagation(container);  
  
        return container;  
    },  
});  
  
  
// 创建并添加自定义控件实例  
var iconceControl = new L.Control.Iconce();  
bdmap.addControl(iconceControl);



function showBaiduMap() {  
  if (document.getElementById('map').style.visibility  !== 'hidden') {  
    // 如果当前谷歌不是隐藏，则显示百度地图  
    clear();
    baiduMap.setOpacity(1); // 设置百度地图透明度为1，显示百度地图    
    document.getElementById('bdmap').style.visibility = '';  
  } else {  
    // 否则显示谷歌地图
    clear();  
    document.getElementById('map').style.visibility = '';  
  }  
}   
  
function clear() {  
    baiduMap.setOpacity(0); // 隐藏百度地图  
    document.getElementById('bdmap').style.visibility = 'hidden'; // 隐藏百度地图元素  
    document.getElementById('map').style.visibility = 'hidden'; // 隐藏其他地图元素  
}

// L.marker([39.905530,116.391305]).addTo(bdmap).bindPopup('<p>我是WGS84坐标下，天安门广场国旗所在位置</p>').openPopup();

// 创建跳转谷歌地图菜单栏控件  
var menuBar = L.control({position: 'bottomleft'}); // 设置位置为左下角  
menuBar.onAdd = function () {    
    var div = L.DomUtil.create('div', 'menuBar');    
    var img = L.DomUtil.create('img', 'menuIcon', div);  // 创建图标元素  
    img.src = 'https://huweibiji.oss-cn-guangzhou.aliyuncs.com/ditu/leaflet/images/google.png'; // 替换为您的图标URL  
    img.alt = '谷歌地图'; // 可选的，为屏幕阅读器提供信息
    img.title = '切换谷歌地图';  
    img.onclick = function () { showBaiduMap(); };  // 设置点击事件处理程序  
    return div;    
};
menuBar.addTo(bdmap); // 将控件添加到地图上  