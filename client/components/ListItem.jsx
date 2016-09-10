var React = require('react');
var ListItem = React.createClass({

	render: function(){
		var data = this.props.detail;
		var attacker_won = '';
		var defender_won = '';
		if(data.attacker_king&&data.attacker_outcome =='win'){
			attacker_won = 'Win';
			// defender_won = 'Loss';
		}
		else if(data.defender_king&&data.attacker_outcome=='loss'){
			// attacker_won= 'Loss';
			defender_won ='Win';
		}

		console.log(data);
		return (
			<div className="card">
				<div className="card-block">
					<h4 className="card-title">{data.name}</h4>
					<p className="card-text">
						Attacker King : {data.attacker_king ||'NA'} <b>{attacker_won}</b>
						<br />
						Defender King : {data.defender_king ||'NA'} <b>{defender_won}</b>
						<br />
						<br />
						Location : {data.location} | Region : {data.region}
					</p>
					<small className="text-muted">Type : {data.battle_type}</small>
				</div>

			</div>
		);
	}
});

module.exports = ListItem;