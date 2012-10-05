var ObjectId = mongoose = require('mongoose').Schema.ObjectId;

module.exports = [
		{
			_id : '506de3038eebf7524342cb4e',
			name : 'Seedling',
			description: 'Seedling phase, from planting seeds until first true leaves appear.',
			expectedNumberOfDays: 10,
			light: {
				fixture: "506de3028eebf7524342cb47",
				fixtureQuantity : 1,
				bulb : "506de3018eebf7524342cb42"
			},
			growSystem: "506de3008eebf7524342cb40",
			growMedium: "rockwool",
			nutrients: [],
			actions: [
				"506de2ec8eebf7524342cb24",
				"506de2ef8eebf7524342cb25",
				"506de2f08eebf7524342cb26",
				"506de2f18eebf7524342cb27"
			],
			idealRanges: [
				"506de30b8eebf7524342cb6d",
				"506de30b8eebf7524342cb6f"
			]
		},
		{
			_id : '506de3048eebf7524342cb4f',
			name : 'Vegetative',
			description: 'Open-ended vegetative phase. Bring in any existing plants or seedlings with their first pair of true leaves.',
			expectedNumberOfDays: 28,
			light: {
				fixture: "506de3028eebf7524342cb48",
				fixtureQuantity: 1,
				bulb: "506de3018eebf7524342cb43",
			},
			growSystem: "506de2ff8eebf7524342cb3c",
			growMedium: "hydroton",
			nutrients: [
				"506de3038eebf7524342cb4b",
				"506de3038eebf7524342cb4c",
				"506de3038eebf7524342cb4d"
			],
			actions: [
				"506de2ec8eebf7524342cb24",
				"506de2ef8eebf7524342cb25",
				"506de2f08eebf7524342cb26",
				"506de2f18eebf7524342cb27"
			],
			idealRanges: [
				"506de30b8eebf7524342cb6d",
				"506de30b8eebf7524342cb6f"
			]
		},
		{
			_id : '506de3048eebf7524342cb50',
			name : "Blooming",
			description: "Open-ended blooming phase. After about 7 days, you should begin to see blossoms.",
			expectedNumberOfDays: 7,
			light: {
				fixture: "506de3028eebf7524342cb48",
				fixtureQuantity: 1,
				bulb: "506de3018eebf7524342cb43",
			},
			growSystem: "506de2ff8eebf7524342cb3c",
			growMedium: "hydroton",
			nutrients: [
				"506de3038eebf7524342cb4b",
				"506de3038eebf7524342cb4c",
				"506de3038eebf7524342cb4d"
			],
			actions: [
				"506de2fc8eebf7524342cb2c",
				"506de2ef8eebf7524342cb25",
				"506de2f08eebf7524342cb26",
				"506de2f18eebf7524342cb27"
			],
			idealRanges: [
				"506de30b8eebf7524342cb6e",
				"506de30b8eebf7524342cb6f"
			]
		},
		{
			_id : '506de3048eebf7524342cb51',
			name : "Fruiting",
			description: "Fruiting phase. Continue to pollinate blossoms and harvest fruit when fully ripened (red).",
			expectedNumberOfDays: 21,
			light: {
				fixture: "506de3028eebf7524342cb48",
				fixtureQuantity: 1,
				bulb: "506de3018eebf7524342cb43",
			},
			growSystem: "506de2ff8eebf7524342cb3c",
			growMedium: "hydroton",
			nutrients: [
				"506de3038eebf7524342cb4b",
				"506de3038eebf7524342cb4c",
				"506de3038eebf7524342cb4d"
			],
			actions: [
				"506de2ef8eebf7524342cb25",
				"506de2f08eebf7524342cb26",
				"506de2f18eebf7524342cb27"
			],
			idealRanges: [
				"506de30b8eebf7524342cb6e",
				"506de30b8eebf7524342cb6f"
			]
		}
	];