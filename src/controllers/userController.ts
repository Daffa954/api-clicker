//proses logika

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, name } = req.body;
  if (!username || !name) {
    res.json({ message: "data tidak lengkap" });
  }
  //cek username
  const search = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (search) {
    res.json({ message: "username sudah ada" });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      name,
      points: 0,
      clickPower: 1,
      unlockedAutoClicker: false,
    },
  });
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { username, name } = req.body;
  if (!username || !name) {
    res.json({ message: "data tidak lengkap" });
  }
  //cek username
  const search = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!search) {
    res.json({ message: "username salah" });
    return;
  }
  res.json(search);
};

export const clickTheButton = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    res.json({ message: "data tidak lengkap" });
    return;
  }

  const addPoints = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      points: {
        increment: 1,
      },
    },
  });
  res.json(addPoints);
};

export const upgradeClicker = async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    if (user.points >= 25) {
      const newClickPower = user.clickPower + 1;
      const newPoints = user.points - 25;
      const updatedUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          clickPower: newClickPower,
          points : newPoints
        },
      });
      res.json(updatedUser);
    } else {
      res.json({ message: "poin tidak mencukupi" });
    }
  } else {
    res.json({ message: "User tidak ditemukan" });
  }
};
