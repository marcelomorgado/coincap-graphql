import fetch from 'node-fetch';

import {
	COINCAP_API_URL,
	SERVICE_PATH,
	SERVICE_PORT
} from "../constants.js"

const graphqlUrl = `http://localhost:${SERVICE_PORT}${SERVICE_PATH}`;

export var fetchGraphQL = (graphqlQuery) => {
	return fetch(graphqlUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: graphqlQuery
		})
	})
	.then(r => r.json());
}

export var fetchRest = (path) => {
	return fetch(COINCAP_API_URL+path)
	.then(res => res.json())
	.then(json => json.data);
}
