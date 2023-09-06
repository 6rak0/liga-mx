import { parseHTML } from 'linkedom';
import { error, json } from '@sveltejs/kit';

type Match = {
	date: string | null;
	hour: string | null;
	local: {
		logo: string | null | undefined;
		score: number;
		pScore: number;
	};
	visit: {
		logo: string | null | undefined;
		score: number;
		pScore: number;
	};
	broadcast: string;
};

export async function GET({ setHeaders }) {
	setHeaders({
		'Cache-Control': `public, s-maxage=${60 * 60 * 24}`
	});
	const html = await getMatches();
	return json(parseMatches(html));
}

async function getMatches() {
	const api = 'https://www.ligamx.net/cancha/partidos';

	const response = await fetch(api);
	if (!response.ok) {
		throw error(400, 'response not ok');
	}
	return await response.text();
}

function parseMatches(html: string) {
	// Parse the HTML document
	const { document } = parseHTML(html);
	// Initialize an array to store the extracted information
	const matches: Match[] = [];

	// Query for <li> elements with id attribute starting with "MrcdrPrtd_"
	const liElements = document.querySelectorAll('li[id^="MrcdrPrtd_"]');
	liElements.forEach((liElement) => {
		const scores: number[] = [];
		const tv: string[] = [];
		const televisoras = liElement.querySelectorAll('.televisoraW');
		const date = liElement.querySelector('.date');
		const hour = liElement.querySelector('.hour');
		const localImage = liElement.querySelector('.local');
		const visitImage = liElement.querySelector('.visit');
		const localScores = liElement.querySelectorAll('span.local');
		const visitScores = liElement.querySelectorAll('span.visit');
		localScores.forEach((spanElement) => {
			scores.push(+spanElement.textContent!);
		});
		visitScores.forEach((spanElement) => {
			scores.push(+spanElement.textContent!);
		});
		televisoras.forEach((el) => {
			tv.push(el.textContent!);
		});

		// Extract the information and create an object
		const match: Match = {
			date: date ? date.textContent : 'N/A',
			hour: hour ? hour.textContent : 'N/A',
			local: {
				logo: localImage?.getAttribute('src'),
				score: scores[1],
				pScore: scores[0]
			},
			visit: {
				logo: visitImage?.getAttribute('src'),
				score: scores[3],
				pScore: scores[2]
			},
			broadcast: tv.length < 1 ? tv[0] : tv.join(' ')
		};

		// Add the object to the result array
		matches.push(match);
	});

	// Output the result array
	return matches;
}
