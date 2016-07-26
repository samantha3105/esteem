angular.module('steem.services', [])
	.service('APIs', ['$http', '$rootScope', function ($http, $rootScope) {
		'use strict';
		
		return {
			login: function (data) {
				return $http.post('http://wwwlogix.com/dev/ezine/services/app/ezine_login_check', data);
			},
			editcompany: function (data) {
				return $http.post('http://wwwlogix.com/dev/ezine/services/app/ezine_edit_companyname', data );
			},
			getarticles: function () {
				return $http.get('http://wwwlogix.com/dev/ezine/services/app/ezine_get_all_articles');
			},
			getarticleStatus: function(data) {
				return $http.post('http://wwwlogix.com/dev/ezine/services/app/ezine_get_user_article_recording', data);
			}, 
			getconfig: function() {
				return $http.get('http://wwwlogix.com/dev/ezine/services/app/ezine_get_config');
			}
		};
	}])


	.filter('timeago', function() {
        return function(input, p_allowFuture) {
		
            var substitute = function (stringOrFunction, number, strings) {
                    var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings= {
                    prefixAgo: '',
                    prefixFromNow: '',
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "seconds",
                    minute: "a minute",
                    minutes: "%d minutes",
                    hour: "an hour",
                    hours: "%d hours",
                    day: "a day",
                    days: "%d days",
                    month: "a month",
                    months: "%d months",
                    year: "a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
            
               
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
                
            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);
			//console.log(prefix+words+suffix+separator);
			prefix.replace(/ /g, '')
			words.replace(/ /g, '')
			suffix.replace(/ /g, '')
			return (prefix+' '+words+' '+suffix+' '+separator);
            
        };
    })

    .filter('parseUrl', function($sce) {
	    /*var urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
	    var emails = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
	 	//var imgs = /\.(jpeg|jpg|gif|png)$/;
	 	var imgs = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gim;
		*/
	    return function(text) {
	    	/*if (text.match(imgs)) {
        		text = text.replace(imgs, '<img src="$1" style="max-width:100%"/>');	
        	} else if (text.match(urls)) {
	        	text = text.replace(urls, '<a href="$1">$1</a>');	
	        }
	        if(text.match(emails)) {
	            text = text.replace(emails, '<a href=\"mailto:$1\">$1</a>');
	        }
	        return $sce.trustAsHtml(text);*/
	        var options = {
	        	/*gfm: true,
				tables: true,
			    breaks: false,
			    pedantic: false,
			    sanitize: true,
			    smartLists: true,
			    smartypants: false*/
			};
	        return marked(text, options);
	    };
	})
	.filter('sp', function($sce, $rootScope) {
	    return function(text) {
	    	if (text) {
	    		return (Number(text.substring(0, text.length-6))/1e6*$rootScope.$storage.steem_per_mvests).toFixed(3);	
	    	}
	    };
	})
	.filter('sd', function($sce, $rootScope) {
	    return function(text) {
	    	if (text) {
	    		return (Number(text.substring(0, text.length-6))/1e6*$rootScope.$storage.steem_per_mvests*$rootScope.$storage.base).toFixed(3);	
	    	}
	    };
	})
    

	.directive('qrcode', function($interpolate) {  
		return {
		    restrict: 'E',
		    link: function($scope, $element, $attrs) {

		      var options = {
		        text: '',
		        width: 128,
		        height: 128,
		        colorDark: '#000000',
		        colorLight: '#ffffff',
		        correctLevel: 'H'
		      };

		      Object.keys(options).forEach(function(key) {
		        options[key] = $interpolate($attrs[key] || '')($scope) || options[key];
		      });

		      options.correctLevel = QRCode.CorrectLevel[options.correctLevel];

		      new QRCode($element[0], options);

		    }
		}
	})
	  
;
