//proses logika

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
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
      password,
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
    if (user.points >= 50) {
      const newClickPower = user.clickPower + 1;
      const newPoints = user.points - 50;
      const updatedUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          clickPower: newClickPower,
          points: newPoints,
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

export const gachaClickPower = async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    if (user.points >= 1) {
      const number = Math.floor(Math.random() * 4) + 1;
      let newClickPower = user.clickPower;
      const newPoints = user.points - 1;

      if (number === 1) {
        newClickPower = user.clickPower * 2;
      }
      const updatedUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          clickPower: newClickPower,
          points: newPoints,
        },
      });
      res.json(updatedUser);
    } else {
      res.json({ message: "poin tidak mencukupi" });
      return;
    }
  } else {
    res.json({ message: "username tidak ada" });
    return;
  }
};
