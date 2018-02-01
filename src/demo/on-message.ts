// @ts-check

/** Import typings */
import { FacebookEventId } from '..';

/** Import project dependencies */
import { sendAsText } from '@messageflow/send-as';

export async function onMessage(
  sender: FacebookEventId,
  text: string
) {
  const url = `${
    process.env.FB_GRAPH_URL
  }/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`;
  const notificationType = 'NO_PUSH';
  const typingDelay = 5e2;

  try {
    return await sendAsText({
      url,
      notificationType,
      typingDelay,
      recipient: sender,
      message: {
        text: /^hi/i.test(text)
          ? 'Hello there!'
          : 'Sorry? 🤔',
      },
    });
  } catch (e) {
    console.error('🚨 onMessage err', e);

    await sendAsText({
      url,
      notificationType,
      typingDelay,
      recipient: sender,
      message: {
        text: '⚠️ Something went wrong. Please try again later!',
      },
    });
  }
}

export default onMessage;
