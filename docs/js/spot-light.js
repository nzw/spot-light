;(function(global) {
	'use strict';

	var _doc = global.document;

	function SpotLightAnimation() {
		this.init.apply(this, arguments);
	}

	SpotLightAnimation.prototype = {
		init: function(config) {
			this.config = config;
			var prefix  = config.prefix;
			var element_name_list = {
				id:    this.createIdNameList(prefix),
				klass: this.createClassNameList(prefix)
			};
			if (config.is_ios) {
				var css_style = this.createAnimationStyle(element_name_list.klass.animation);
				this.element  = this.createStyleTag(css_style);
			}
			this.timeLine(element_name_list);
		},
		createIdNameList: function(prefix) {
			return {
				circle: prefix + 'circle',
				screen: prefix + 'screen',
				color:  prefix + 'color',
			};
		},
		createClassNameList: function(prefix) {
			return {
				flash: prefix + 'flash',
				fadeIn: prefix + 'fade-in',
				darkness: prefix + 'darkness',
				animation: prefix + 'animation',
			};
		},
		timeLine: function(element_name_list) {
			var that       = this;
			var timer_list = this.config.timer_list;
			var id_list    = element_name_list.id;
			var class_list = element_name_list.klass;
			setTimeout(function() {
				var head       = _doc.getElementsByTagName('head')[0];
				var dom_circle = _doc.getElementById(id_list.circle);
				var dom_dark   = _doc.getElementById(id_list.screen);
				var dom_color  = _doc.getElementById(id_list.color);

				dom_dark.setAttribute('class', class_list.darkness);

				setTimeout(function() {
					if (that.config.is_ios) head.appendChild(that.element);
					dom_dark.removeAttribute('class');
					dom_circle.setAttribute('class', class_list.animation);
					dom_color.setAttribute('class', class_list.flash);

					setTimeout(function() {
						dom_color.removeAttribute('class');

						setTimeout(function() {
							dom_circle.removeAttribute('class');
						}, timer_list[3]);
					}, timer_list[2]);
				}, timer_list[1]);
			}, timer_list[0]);
		},
		createAnimationStyle: function(class_name) {
			var x = 0;
			var y = 0;
			var scale = 1;
			var css_style = '@-webkit-keyframes ' + class_name + '{';
			var config = this.config;
			var count  = config.move_count;
			var frame  = this.decimal(100 / count);
			var last_count = count - 1;
			for (var i = 0; i < count; i++) {
				if (i >= last_count) {
					x = config.goal.x;
					y = config.goal.y;
				} else {
					x = -(this.decimal(Math.random() * 50));
					y = -(this.decimal(Math.random() * 50));
				}
				css_style += this.createKeyframes((frame * i), scale, x, y);
			}
			css_style += this.createKeyframes(100, 30, 0, 0);
			return css_style;
		},
		createStyleTag: function(css_style) {
			var rules = _doc.createTextNode(css_style);
			var element = _doc.createElement('style');
			element.media = 'screen';
			element.type = 'text/css';
			element.appendChild(rules);
			return element;
		},
		createKeyframes: function(frame, scale, x, y) {
			if (frame < 100) return frame + '% {transform: scale(' + scale + ') translate(' + x + '%, ' + y + '%);} ';
			return frame + '% {transform: scale(' + scale + ');} }';
		},
		decimal: function(num) {
			return (parseInt(num * 10) / 10);
		}
	};
	global.SpotLightAnimation = SpotLightAnimation;
}(this.self || global));
