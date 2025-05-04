#2025/05/02作成

from flask import Flask, render_template, request, Response
import pandas as pd

app = Flask(__name__)
# gdf.pkl の読み込み

gdf = pd.read_pickle("gdf.pkl")  # full_address, post_code, clicked, geometry 列あり

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def geojson_data():
    # GeoJSON を直接返却
    return Response(gdf.to_json(), mimetype='application/json')

@app.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    address = data.get('full_address')
    # clicked フラグをトグル
    mask = gdf['full_address'] == address
    current = bool(gdf.loc[mask,'clicked'].iloc[0])
    gdf.loc[mask, 'clicked'] = not current
    # 永続化
    gdf.to_pickle("gdf.pkl")
    #新しい状態を返す
    return {'status': 'ok', 'new_state': not current}

if __name__ == '__main__':
    app.run(debug=True)