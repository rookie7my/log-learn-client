import { rest } from "msw";

import db from "../model";
import delayedResponse from "../response/delayedResponse";
import mockSession from "../mockSession";

const handlers = [
  rest.get("/api/settings", (req, res, ctx) => {
    const currentUserId = mockSession.getUserId();
    const { username, email, shortIntroduction, introduction } = db.user.findFirst({
      where: {
        id: {
          equals: currentUserId
        }
      }
    });

    return delayedResponse(
      ctx.status(200),
      ctx.json({
        username,
        email,
        shortIntroduction,
        introduction
      })
    );
  }),
  rest.patch("/api/settings/username", (req, res, ctx) => {
    const { username } = req.body;
    const userFoundByUsername = db.user.findFirst({
      where: {
        username: {
          equals: username
        }
      }
    });
    if(userFoundByUsername) {
      return delayedResponse(
        ctx.status(409),
        ctx.json({
          code: "user-001",
          errorMessage: "이미 사용중인 유저이름입니다.",
          errors: []
        })
      );
    }
    const currentUserId = mockSession.getUserId();
    db.user.update({
      where: {
        id: {
          equals: currentUserId
        }
      },
      data: { username }
    });

    return delayedResponse(ctx.status(204));
  }),
  rest.patch("/api/settings/short-introduction", (req, res, ctx) => {
    const currentUserId = mockSession.getUserId();
    const { shortIntroduction } = req.body;
    db.user.update({
      where: {
        id: {
          equals: currentUserId
        }
      },
      data: { shortIntroduction }
    });

    return delayedResponse(ctx.status(204));
  }),
  rest.patch("/api/settings/password", (req, res, ctx) => {
    const { password, newPassword } = req.body;
    const currentUserId = mockSession.getUserId();
    const currentUser = db.user.findFirst({
      where: {
        id: {
          equals: currentUserId
        }
      }
    });

    if(password !== currentUser.password) {
      return delayedResponse(
        ctx.status(409),
        ctx.json({
          code: "user-003",
          errorMessage: "비밀번호가 올바르지 않습니다.",
          errors: []
        })
      );
    }

    db.user.update({
      where: {
        id: {
          equals: currentUserId
        }
      },
      data: {
        password: newPassword
      }
    });

    return delayedResponse(ctx.status(204));
  }),
  rest.patch("/api/settings/introduction", (req, res, ctx) => {
    const { introduction } = req.body;
    const currentUserId = mockSession.getUserId();
    db.user.update({
      where: {
        id: {
          equals: currentUserId
        }
      },
      data: { introduction }
    });

    return delayedResponse(ctx.status(204));
  })
];

export default handlers;
