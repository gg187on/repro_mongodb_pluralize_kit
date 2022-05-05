import { v4 as uuid } from '@lukeed/uuid';
import mongoose from 'mongoose';
import * as cookie from 'cookie';
import init from '$lib/db/init';

mongoose.pluralize(null);
mongoose.connect("mongodb://localhost:27017/repro_mongodb_pluralize_kit_issue", {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(init)

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies['userid'] || uuid();

	const response = await resolve(event);

	if (!cookies['userid']) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};
