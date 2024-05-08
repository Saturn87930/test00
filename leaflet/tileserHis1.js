class tileserHisImageryProvider extends Cesium.UrlTemplateImageryProvider {
    constructor(options) {
        // 设置默认的 minimumLevel 和 tilingScheme
        options.url = "https://tileser.giiiis.com/timetile/";
        options.minimumLevel = 1;
        options.maximumLevel = 18;
        options.tilingScheme = new Cesium.GeographicTilingScheme();

        super(options);

        // 初始化 indexTime 属性
        this.indexTime = options.indexTime || 0; // 默认值为0
    }
    async requestImage(x, y, level, request) {
        // 重写 requestImage 方法以支持异步操作

        // 异步获取时间信息
        try {
            // 根据获取的时间信息构建新的 URL
            let imageUrl = this.buildImageUrl(this.indexTime, x, y, level);
            return Cesium.ImageryProvider.loadImage(this, imageUrl);
        } catch (error) {
            return undefined;
        }
    }


    buildImageUrl(indexTime, x, y, level) {
        return `https://tileser.giiiis.com/timetile/${indexTime}/${level}/${x}/${y}.jpg`;
    }
}



//获取视口范围的信息。
async function getCurrentTileCoordinates(viewer) {
    const scene = viewer.scene;
    const ellipsoid = scene.globe.ellipsoid;
    const camera = scene.camera;

    // 获取相机的经纬度
    const cameraPositionCartographic = ellipsoid.cartesianToCartographic(camera.position);
    const longitude = Cesium.Math.toDegrees(cameraPositionCartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cameraPositionCartographic.latitude);

    // 计算缩放级别 (Z)
    const cameraHeight = cameraPositionCartographic.height;
    const level = altToZoom(cameraHeight);

    // 转换经纬度为瓦片坐标 (X, Y)
    let x = Math.floor((longitude + 180) / 360 * Math.pow(2, level + 1));
    let y = Math.floor((90 - latitude) / 180 * Math.pow(2, level));

    const allTimes = await xyzToAllInfo(x, y, level);

    return allTimes;
}



//3D级数转为2D高
function altToZoom(cameraHeight) {
    const levels = [
        { maxAlt: 250000000, level: 0 },
        { maxAlt: 25000000, level: 1 },
        { maxAlt: 9000000, level: 2 },
        { maxAlt: 7000000, level: 3 },
        { maxAlt: 4400000, level: 4 },
        { maxAlt: 2000000, level: 5 },
        { maxAlt: 1000000, level: 6 },
        { maxAlt: 493977, level: 7 },
        { maxAlt: 218047, level: 8 },
        { maxAlt: 124961, level: 9 },
        { maxAlt: 56110, level: 10 },
        { maxAlt: 40000, level: 11 },
        { maxAlt: 13222, level: 12 },
        { maxAlt: 7000, level: 13 },
        { maxAlt: 4000, level: 14 },
        { maxAlt: 2500, level: 15 },
        { maxAlt: 1500, level: 16 },
        { maxAlt: 600, level: 17 },
        { maxAlt: 250, level: 18 },
        { maxAlt: 150, level: 19 },
        { maxAlt: 50, level: 20 }
    ];

    for (const { maxAlt, level } of levels) {
        if (cameraHeight >= maxAlt) {
            return level;
        }
    }

    return 20; // 默认级别
}


async function xyzToAllInfo(x, y, z) {
    const response = await fetch(`https://tileser.giiiis.com/xyzinfo/${z}/${x}/${y}`);
    const jsonData = response.json();
    return jsonData;
}
