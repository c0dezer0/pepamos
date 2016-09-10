var React = require('react');
var ListItem = require('./ListItem.jsx');
var Reflux = require('reflux');
var Actions = require('../reflux/actions.jsx');
var SearchStore = require('../reflux/search.store.jsx');

var List = React.createClass({
	mixins:[Reflux.listenTo(SearchStore, 'onChange')],
	getInitialState: function(){
		return {
			'searchTxt':'',
			'battles':[],
			'option': 'name',
			'isLoading':true
		};
	},
	componentWillMount: function(){
		Actions.getBattles();
		
	},
	optionChange: function(e){
		this.setState({option:e.target.value});
	},
	onChange:function(e, battles){
		
		this.setState({battles: battles.data, isLoading:false});
	},
	search:function(e){
		if(this.state.searchTxt){
			var url ='';
			if(this.state.option=='king'){
				url = '/api/search?attacker_king='+this.state.searchTxt+'&defender_king='+this.state.searchTxt;
			}
			else{
				url = '/api/search?'+this.state.option+'='+this.state.searchTxt;
			}
			Actions.search(url);
			this.setState({isLoading:true, battles:[]});
		}
		
	},
	onInputChange:function(e){
		this.setState({searchTxt: e.target.value});
	},

	render:function(){
		var listItems = this.state.battles.map(function(item, i){
			return <ListItem key={item._id} detail={item} />
		});
		var Loader = '';
		if(this.state.isLoading){
			Loader = <h2>Loading</h2>
		}
		return (
			<div>
				<br />
				<div className="form">
					<div className="form-group row">
						<div className="col-sm-4">
							<select className="form-control" value={this.state.option} onChange={this.optionChange}>
								<option value="name">Name</option>
								<option value="king">King</option>
								<option value="battle_type">Type</option>
								<option value="location">Location</option>
							</select>
						</div>
						<div className="col-sm-4">
							<input 
							className="form-control"
							type="text"
							placeholder={"Search Battle by " + this.state.option }
							value={this.state.searchTxt} 
							onChange={this.onInputChange} />
						</div>
						<div className="col-sm-4">
							<button type='button' className="btn btn-primary" onClick = {this.search}> Search</button>
						</div>
					</div>
				</div>
				<br />
				<br />
				<div className="card-columns">
					{listItems}
				</div>
				<div className="col-sm-12">
					{Loader}
				</div>
			</div>
		);
	}
});

module.exports = List;