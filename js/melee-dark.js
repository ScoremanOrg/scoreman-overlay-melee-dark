(function (Vue, fetch, window) {
	var REFRESH_TIMEOUT = 1000; // in MS

    var vm = new Vue({
        el: '#scoreboard',
        data: function () {
            return {
                scoreboard: {},
                baseUrl: null
            }
        },
        methods: {
            isFilled: isFilled,
            getCharacterUrl: getCharacterUrl,
            getCharacterColorStyle: getCharacterColorStyle
        },
        mounted: onMounted,
    })

    function onMounted() {
        var vm = this;
        getBaseUrl(vm)
            .then(() => getScoreboard(vm));
    }

    function getBaseUrl(vm) {
        return fetch('../config.json')
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					console.error('There was an error while fetching the scoreboad. Server is down?');
				}
			})
            .then((config) => {
                vm.baseUrl = config.baseUrl;
            })
    }

	function isFilled(str) {
		return !!str && str.trim().length > 0;
	}

    function getCharacterUrl(character) {
        var vm = this;
        return `${vm.baseUrl}/static/characters/${vm.scoreboard.game.id}/${character.id}.png`;
    }

    function getCharacterColorStyle(character) {
        if (!(character && character.color)) {
            return ''
        } else {
            return `border-color: ${character.color.hex}`;
        }
    
    }

	function getScoreboard(vm) {
		return fetch(`${vm.baseUrl}/api/scoreboard`)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					console.error('There was an error while fetching the scoreboad. Server is down?');
				}
			})
			.then(function (data) {
				vm.scoreboard = data;
				
				window.setTimeout(function () {
					getScoreboard(vm);
                }, REFRESH_TIMEOUT);
			});
    }
    
}(Vue, window.fetch, window));
