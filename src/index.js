const debug = require('debug')('mail');
const EWS = require('node-ews');

module.exports = (route) => {
  const validate = route.middlewares.validate;
  const expect = route.expect;

  route.post('/', validate({
    body: {
      recipient: expect.string().email().required(),
      subject: expect.string().required(),
      content: expect.string().required(),
      type: expect.string().required(),
    },
  }), (req, res) => {
    //console.log('POST', req.body);
    const ews = new EWS(route.locals.config.ews);

    ews.run('CreateItem', {
      attributes: {
        MessageDisposition: 'SendAndSaveCopy',
      },
      SavedItemFolderId: {
        DistinguishedFolderId: {
          attributes: {
            Id: 'sentitems',
          },
        },
      },
      Items: {
        Message : {
          ItemClass: 'IPM.Note',
          Subject: req.body.subject,
          Body: {
            attributes: {
              BodyType : req.body.type, // can be 'HTML' or 'Text'
            },
            $value: req.body.content,
          },
          ToRecipients: {
            Mailbox: {
              EmailAddress : req.body.recipient,
            },
          },
          IsRead: 'false',
        },
      },
    })
      .then(result => {
        //console.log(JSON.stringify(result));
        console.log(`sent email "${req.body.subject}" to "${req.body.recipient}"`);
        res.send(`sent email "${req.body.subject}" to "${req.body.recipient}"`);
      })
      .catch(err => {
        console.error(err.stack);
        res.status(500).send(err.stack);
      });
  });
};
