// 2025/05/02作成
// 地図を作成
var map = L.map('map').setView([35.0116, 135.7681], 12);

// OSM タイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// GeoJSON を取得して描画
fetch('/data')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: feature => ({
        color: feature.properties.clicked ? 'red' : 'blue',
        weight: 1,
        fillOpacity: 0.4
      }),
      onEachFeature: (feature, layer) => {
        const addr = feature.properties.full_address;
        // クリックイベント
        layer.on('click', () => {
          fetch('/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_address: addr })
          })
          .then(res => res.json())
          .then(json => {
            const newState = json.new_state;
            // スタイル更新（リロード不要）
            layer.setStyle({
              color: newState ? 'red' : 'blue'
            });
          });
        });
      }
    }).addTo(map);
  });