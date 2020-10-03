import {Link, Store} from '../store/model';
import {logger, Print} from '../logger';
import {config} from '../config';

const telnyxConfig = config.notifications.telnyx;
const telnyx = require('telnyx')(telnyxConfig.apiKey);

export function sendTelnyxMessage(link: Link, store: Store) {
	(async () => {
		const givenUrl = link.cartUrl ? link.cartUrl : link.url;
		const message = `${Print.inStock(link, store)}\n${givenUrl}`;

		telnyxConfig.to.forEach(async function (value) {
			try {
				await telnyx.messages.create({
					'from': telnyxConfig.from, // Your Telnyx number
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
