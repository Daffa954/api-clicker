//proses logika

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
  //cek username
  const search = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (search) {
    res.status(409).json({ message: "username sudah ada" });
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
  res.status(200).json(user.username);
  return;
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(409).json({ message: "data tidak lengkap" });
  }
  //cek username
  const search = await prisma.user.findUnique({
    where: {
      username: username,
      password: password,
    },
  });
  if (!search) {
    res.status(409).json({ message: "username salah" });
    return;
  }
  res.status(200).json({ username: search.username });
  return;
};

export const findUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    res.status(409).json({ message: "data tidak lengkap" });
  }
  //cek username
  const search = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!search) {
    res.status(409).json({ message: "username salah" });
    return;
  }
  res.status(200).json(search);
  return;
};

export const clickTheButton = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ message: "data tidak lengkap" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: { clickPower: true, points: true }, // Ambil hanya nilai clickPower dan points
    });

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        points: {
          increment: user.clickPower, // Tambahkan points sesuai clickPower
        },
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating points:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui points" });
  }
};




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../userPhoto")); // Direktori penyimpanan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang unik
  },
});

export const upload = multer({ storage });

export const upgradeClicker = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
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
      res.status(200).json(updatedUser);
      return;
    } else {
      res.status(409).json({ message: "poin tidak mencukupi" });
      return;
    }
  } else {
    res.status(409).json({ message: "User tidak ditemukan" });
    return;
  }
};

export const gachaClickPower = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username ) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    if (user.points >= 100) {
      const number = Math.floor(Math.random() * 4) + 1;
      let newClickPower = user.clickPower;
      const newPoints = user.points - 100;

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

export const gachaPoints = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username ) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    if (user.points >= 100) {
      const number = Math.floor(Math.random() * 4) + 1;
      let newPoints = 0;
      if (number === 3) {
        newPoints = user.points * 2;
      }
      const updatedUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          points: newPoints,
        },
      });
      res.status(200).json({ message: number, updatedUser });
      return;
    } else {
      res.json({ message: "poin tidak mencukupi" });
      return;
    }
  } else {
    res.status(409).json({ message: "username tidak ada" });
    return;
  }
};
export const unlockAutoClicker = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username ) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    if (user.points >= 150) {
      const newPoints = user.points - 150;
      const updatedUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          unlockedAutoClicker: true,
          autoClickerPower: {
            increment: 1,
          },
          points: newPoints,
        },
      });
      res.status(200).json(updatedUser);
      return;
    } else {
      res.json({ message: "poin tidak mencukupi" });
      return;
    }
  } else {
    res.status(409).json({ message: "username tidak ada" });
    return;
  }
};

export const autoClick = async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: { autoClickerPower: true, points: true },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        points: {
          increment: user.autoClickerPower, // Tambahkan points sesuai clickPower
        },
      },
    });
    res.status(200).json(updatedUser);
    return;
  } else {
    res.status(409).json({ message: "user tidak ada" });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, password, name } = req.body;

  const search = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  const profileImage = req.file
    ? `userPhoto/${req.file.filename}`
    : search?.profileImage;
  if (!search) {
    res.status(409).json({ message: "username tidak ada" });
    return;
  }
  {
    try {
      // Update user dengan data baru
      const updatedUser = await prisma.user.update({
        where: { username: username },
        data: {
          username: username,
          password: password,
          name: name,
          profileImage: profileImage,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username ) {
    res.status(409).json({ message: "data tidak lengkap" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    const delUser = await prisma.user.delete({
      where: {
        username: username,
      },
    });
    res.status(200).json({ message: "akun berhasil dihapus" });
    return;
  } else {
    res.status(409).json({ message: "username tidak ada" });
    return;
  }
};
