import {Link, Store} from '../store/model';
import {logger, Print} from '../logger';
import {config} from '../config';

const config = config.notifications.telnyx;
const telnyx = require('telnyx')(config.apiKey);

export function sendTelnyxMessage(link: Link, store: Store) {
	(async () => {
		const givenUrl = link.cartUrl ? link.cartUrl : link.url;
		const message = `${Print.inStock(link, store)}\n${givenUrl}`;

		config.to.forEach(async function (value) {
			try {
				await telnyx.messages.create({
					'from': config.from, // Your Telnyx number
					'to': value,
					'text': message,
				});
				logger.info('✔ telnyx message sent');
			} catch (error) {
				logger.error('✖ couldn\'t send telnyx message', error);
			}
		});
	})();
}
