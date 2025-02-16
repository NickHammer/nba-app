from flask import Flask, render_template, jsonify, request
from nba_api.stats.endpoints import playercareerstats, commonallplayers, playerawards

app = Flask(__name__)

all_players = commonallplayers.CommonAllPlayers(is_only_current_season=0).get_data_frames()[0]
player_ids = {row['DISPLAY_FIRST_LAST']: row['PERSON_ID'] for _, row in all_players.iterrows()}
player_names = sorted(all_players["DISPLAY_FIRST_LAST"].tolist())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_all_players')
def get_all_players():
    return jsonify(player_names)

@app.route('/get_stats', methods=['GET'])
def get_stats():
    player_name = request.args.get('player')
    player_id = player_ids.get(player_name)

    if not player_id:
        return jsonify({"error": "Player not found"}), 404

    career_stats = playercareerstats.PlayerCareerStats(player_id=player_id).get_data_frames()[0]
    awards = playerawards.PlayerAwards(player_id=player_id).get_data_frames()[0]
    return jsonify({
        "stats": career_stats.to_dict(orient="records"),
        "awards": awards.to_dict(orient="records") if not awards.empty else []
    })

if __name__ == '__main__':
    app.run(debug=True)
