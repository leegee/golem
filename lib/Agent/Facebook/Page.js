'use strict';

const Base = require('../../Base');
const Post = require('./Post');

module.exports = function Page(id, options) {
	Base.call(this, options);
	this.id = id;
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
	return new Promise ( (resolve, reject) => {
		this.options.FB.api('/' + this.id + '/feed', (res) => {
			if ((this.error = this.isError(res))) {
				reject(this.error);
			} else {
				this.feed2postings( res.data ).then(() => {
					resolve();
				});
			}
		});
	});
};

module.exports.prototype.feed2postings = function (feedData) {
	this.logger.debug('feed2postings creating %d Posts', feedData.length);
	var saved = [];
	feedData.forEach( (i) => {
		i.source = 'Facebook';
		saved.push( new Post(i).save() );
	});
	return Promise.all( saved );
};
