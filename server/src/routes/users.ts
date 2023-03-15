import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sign, verify } from "jsonwebtoken";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/me", async (request, reply) => {
    const jwt = request.headers["authorization"];
    console.log(jwt);

    const [, token] = jwt!.split(" ");

    if (!token) {
      return reply.status(401).send({ error: "Token not provided" });
    }

    const userInfoBodySchema = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      photoUrl: z.string().url(),
    });

    const decoded = verify(token, "secret");

    const { name, email, id, photoUrl } = userInfoBodySchema.parse(decoded);
    console.log("DECODED", decoded);

    return reply.send({
      id,
      name,
      email,
      photoUrl,
    });
  });

  app.get("/users/:id", async (request, reply) => {
    const getUserParams = z.object({
      id: z.string(),
    });

    const { id } = getUserParams.parse(request.params);

    const userResponse = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    reply.status(200).send({
      id: userResponse!.id,
      name: userResponse!.name,
      photoUrl: userResponse!.avatarUrl,
      bio: userResponse!.bio,
      createdAt: userResponse!.createdAt,
    });
  });

  app.get("/users", async (request, reply) => {
    const getUserByNameParams = z.object({
      name: z.string(),
    });

    const { name } = getUserByNameParams.parse(request.query);

    const userResponse = await prisma.user.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    if (userResponse === null) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    reply.status(200).send(userResponse);
  });

  app.post("/users", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      googleId: z.string(),
      avatarUrl: z.string().url(),
    });

    const { name, email, googleId, avatarUrl } =
      createTransactionBodySchema.parse(request.body);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          avatarUrl,
        },
      });
    }

    const token = sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.avatarUrl,
      },
      "secret",
      {
        expiresIn: "7d",
      }
    );

    console.log("token", token);

    return reply.status(201).send({ token });
  });

  app.get("/users/:id/relationships", async (request, reply) => {
    const getUserParams = z.object({
      id: z.string(),
    });

    const { id } = getUserParams.parse(request.params);

    const userResponse = await prisma.relationship.findMany({
      where: {
        user_id: id,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return reply.status(200).send(userResponse);
  });

  app.post("/users/:id/relationships", async (request, reply) => {
    const getUserParams = z.object({
      id: z.string(),
    });

    const getFollowingUserId = z.object({
      following_user_id_data: z.string(),

    });

    const { id } = getUserParams.parse(request.params);
    const { following_user_id_data } = getFollowingUserId.parse(request.body);

    console.log("following_user_id_data", following_user_id_data);
    console.log("id", id);


    const isFollowing = await prisma.relationship.findFirst({
      where: {
        user_id: id,
        following_user_id: following_user_id_data,
      },
    });

    // if (search_user_name) {
    //   const userExists = await prisma.relationship.findFirst({
    //     where: {
    //       user_id: id,
    //       following_user_id: following_user_id_data,
    //       User: {
    //         name: search_user_name,
    //       },
    //     },
    //   });

    //   if (!userExists) {
    //     return reply.status(404).send({
    //       message: "User not found",
    //     });
    //   }
    // }

    

    if (isFollowing) {
      return reply.status(401).send({
        message: "You're already following this user",
      });
    }

    const userResponse = await prisma.relationship.create({
      data: {
        user_id: id,
        following_user_id: following_user_id_data,
      },
    });

    return reply.status(201).send(userResponse);
  });

  app.patch("/users/:id/relationships", async (request, reply) => {
    const getUserParams = z.object({
      id: z.string(),
    });

    const getFollowingUserId = z.object({
      following_user_id_data: z.string(),
    });

    const { id } = getUserParams.parse(request.params);
    const { following_user_id_data } = getFollowingUserId.parse(request.body);

    console.log("following_user_id_data", following_user_id_data);
    console.log("id", id);

    const isFollowing = await prisma.relationship.findFirst({
      where: {
        user_id: id,
        following_user_id: following_user_id_data,
      },
    });

    if (isFollowing) {
      console.log("CAIU NO DELETE");
      await prisma.relationship.delete({
        where: {
          id: isFollowing?.id,
        },
      });
    } else {
      await prisma.relationship.create({
        data: {
          user_id: id,
          following_user_id: following_user_id_data,
        },
      });
    }

    reply.status(200).send({ message: "likedVideo changed" });
  });
}
