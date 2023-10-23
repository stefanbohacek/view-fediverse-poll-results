import express from "express";
import debug from "../modules/debug.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let account;
  let poll;

  if (req.query.url) {
    let url = req.query.url;
    const urlParsed = new URL(url);
    // console.log({urlParsed});

    let instance = `${urlParsed.protocol}//${urlParsed.host}`;

    //TODO check if supported

    let user = urlParsed.pathname.split("/")[1];
    let username = `${user}@${urlParsed.host}`;
    const atCount = (url.match(/@/g) || []).length;

    if (atCount > 1) {
      const response = await fetch(url, {
        redirect: "follow",
        follow: 10,
      });

      url = response.url;
    }

    const pollURL = `${url}.json`;
    // console.log({pollURL});

    const postDataRequest = await fetch(pollURL);
    const postData = await postDataRequest.json();

    if (postData?.votersCount){
      const accountURL = postData.attributedTo;
      const accountDetailsURL = `${accountURL}.json`;
      const accountDetailsRequest = await fetch(accountDetailsURL);
      const accountDetails = await accountDetailsRequest.json();
  
      console.log({postData});
  
      // console.log({ user });
      debug("account details", accountDetails);
      debug("poll data", postData);
  
      account = {
        username,
        url: accountURL,
        name: accountDetails.name || accountDetails.preferredUsername,
        description: accountDetails.summary,
        image: accountDetails.icon?.url || accountDetails.image?.url,
      };
  
      const publishedTimestamp = new Date(postData.published);
      const endTimestamp = new Date(postData.endTime).getTime();
      const todayTimestamp = new Date().getTime();
  
      poll = {
        url: postData.url,
        published: postData.published,
        publishedHuman: publishedTimestamp.toLocaleDateString("en", {
          month: "long",
          year: "numeric",
          day: "numeric",
        }),
        endTime: postData.endTime,
        content: postData.content,
        votersCount: postData.votersCount.toLocaleString(),
        isClosed: todayTimestamp - endTimestamp > 0,
      };
  
      let pollVotes;
  
      if (postData.oneOf) {
        poll.type = "single";
        pollVotes = postData.oneOf;
      } else if (postData.anyOf) {
        poll.type = "multiple";
        pollVotes = postData.anyOf;
      }
  
      const voteCounts = pollVotes.map((vote) => {
        return vote.replies.totalItems;
      });
  
      const voteCountMax = Math.max(...voteCounts);
  
      const votesTotal = voteCounts.reduce((total, num) => {
        return total + num;
      });
  
      poll.votes = pollVotes.map((vote) => {
        let votesPortion;
        let votesPercentage;
  
        if (poll.type === "multiple") {
          votesPercentage = `${Math.round(
            (vote.replies.totalItems / poll.votersCount) * 100
          )}%`;
          votesPortion = (vote.replies.totalItems / poll.votersCount) * 100;
        } else {
          votesPercentage = `${Math.round(
            (vote.replies.totalItems / votesTotal) * 100
          )}%`;
          votesPortion = (vote.replies.totalItems / votesTotal) * 100;
        }
  
        return {
          label: vote.name,
          votesPercentage,
          votesPortion,
          count: vote.replies.totalItems.toLocaleString(),
        };
      });
    }
  }

  debug("data", { account, poll });

  res.render("../views/poll.handlebars", {
    account,
    poll,
  });
});

export default router;
