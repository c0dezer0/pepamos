var Fetch = require('whatwg-fetch');

module.exports = {
	get: function(url){
		return fetch(url)
		.then(function(response){
			return response.json();
		})
	},
	post: function(url, data){
		return fetch(url,{
			headers:{
				'Accept':'text/plain',
				'Content-Type':'application/json'
			},
			method:'POST',
			body : JSON.stringify(data)
		})
		.then(function(response){
			return response.text();
		})
	}
}