var map, marker, pano, pano_service, h, p, x, y, z, searchService, local, cityname, x_PI = 52.35987755982988;
function getWindowHeight() {
	return window.self && self.innerHeight ? self.innerHeight: document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight: 0
}
// function mapresize() {
// 	th = getWindowHeight();
// 	document.getElementById("panomap").style.height = th + "px";
// 	document.getElementById("map").style.height = th + "px"
// }
function openInfo(b, d) {
	var a = new BMap.InfoWindow(b, {
		title: d,
		enableMessage: !1,
		enableAutoPan: !1
	});
	marker.openInfoWindow(a);
	map.setCenter(marker.getPosition())
}
// function gothere(b) {
// 	map.clearOverlays();
// 	local.search(b)
// }
// function gotocity(b) {
// 	0 < b && (top.location = 9999 == b ? "https://www.earthol.org/city.html": "https://www.earthol.org/city-" + b + ".html")
// }
// function showshare() {
// 	var b = pano.getPov(),
// 	d = pano.getZoom(),
// 	a = marker.getPosition();
// 	openInfo('<div><strong>\u53ef\u76f4\u8fbe\u6b64\u4f4d\u7f6e\u7684\u94fe\u63a5\uff1a<br /><input id="sharelink" size="21" value="https://map.earthol.org/baidu/?x=' + (Math.round(1E5 * a.lng) / 1E5 + "&y=" + Math.round(1E5 * a.lat) / 1E5 + "&h=" + Math.round(100 * b.heading) / 100 + "&p=" + Math.round(100 * b.pitch) / 100 + "&z=" + d) + '" readonly="readonly" onclick="this.select()" onfocus="this.select()" /><br /><br />\u9009\u53d6\u94fe\u63a5\uff0c\u7136\u540e\u6309\u201cCtrl+C\u201d\u590d\u5236</strong><br /></div>', "\u5206\u4eab\u5730\u56fe")
// }
// window.onresize = function() {
// 	mapresize()
// };
// top.location != self.location && (top.location = self.location);
function loadmap() {
	// mapresize();
	map = new BMap.Map("map");
	var b = new BMap.Point(x, y);
	map.addControl(new BMap.NavigationControl);
	map.addControl(new BMap.MapTypeControl({
		mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
	}));
	map.addControl(new BMap.ScaleControl);
	map.centerAndZoom(b, 15);
	map.enableScrollWheelZoom();
	map.addTileLayer(new BMap.PanoramaCoverageLayer);
	var d = new BMap.Icon("https://jsd.onmicrosoft.cn/gh/Saturn87930/test00/leaflet/images/IconMapSend.png", new BMap.Size(48, 48));
	marker = new BMap.Marker(b, {
		icon: d,
		enableMassClear: !1
	});
	marker.enableDragging();
	map.addOverlay(marker);
	pano = new BMap.Panorama("panomap");
	pano.setPov({
		heading: 20,
		pitch: 15
	});
	pano.setPosition(b);
	pano_service = new BMap.PanoramaService;
	marker.addEventListener("dragend",
	function(a) {
		pano_service.getPanoramaByLocation(a.point, 99999,
		function(c) {
			pano.setId(c.id)
		})
	});
	map.addEventListener("click",
	function(a) {
		pano_service.getPanoramaByLocation(a.point, 99999,
		function(c) {
			pano.setId(c.id)
		})
	});
	pano.addEventListener("position_changed",
	function() {
		var a = pano.getPosition();
		map.panTo(a);
		marker.setPosition(a)
	});
	// local = new qq.maps.SearchService({
	// 	complete: function(a) {
	// 		if ("undefined" == typeof a.detail.pois) return openInfo("\u672a\u80fd\u627e\u5230\u6709\u6548\u7684\u7ed3\u679c\u4f4d\u7f6e\uff0c\u8bf7\u68c0\u67e5\u60a8\u7684\u641c\u7d22\u8bcd\u662f\u5426\u6b63\u786e\uff0c\u5e76\u5c1d\u8bd5\u91cd\u65b0\u641c\u7d22\u3002", "\u641c\u7d22\u7ed3\u679c"),
	// 		!1;
	// 		var c = a.detail.pois[0].latLng;
	// 		a = c.getLng();
	// 		var e = c.getLat();
	// 		c = Math.sqrt(a * a + e * e) + 2E-5 * Math.sin(e * x_PI);
	// 		a = Math.atan2(e, a) + 3E-6 * Math.cos(a * x_PI);
	// 		a = new BMap.Point(c * Math.cos(a) + .0065, c * Math.sin(a) + .006);
	// 		pano_service.getPanoramaByLocation(a, 999,
	// 		function(f) {
	// 			null == f ? openInfo("\u60a8\u8981\u627e\u7684\u5730\u65b9\u6682\u65f6\u6ca1\u6709\u8857\u666f\u56fe\u50cf\u63d0\u4f9b\uff0c\u8bf7\u8c03\u6574\u641c\u7d22\u8bcd\u91cd\u65b0\u641c\u7d22\u3002", "\u641c\u7d22\u7ed3\u679c") : pano.setId(f.id)
	// 		})
	// 	},
	// 	error: function(a) {
	// 		openInfo("\u672a\u80fd\u627e\u5230\u6709\u6548\u7684\u7ed3\u679c\u4f4d\u7f6e\uff0c\u8bf7\u68c0\u67e5\u60a8\u7684\u641c\u7d22\u8bcd\u662f\u5426\u6b63\u786e\uff0c\u5e76\u5c1d\u8bd5\u91cd\u65b0\u641c\u7d22\u3002", "\u641c\u7d22\u7ed3\u679c")
	// 	}
	// });
	// local.setLocation(cityname)
};