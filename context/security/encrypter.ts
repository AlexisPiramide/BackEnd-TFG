import bcrypt from "bcrypt";
const saltRounds = 10;

const hash = (text: string): string => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(String(text), salt);
};

const compare = (text: String, encrypted: string): boolean => {
  return bcrypt.compareSync(String(text), encrypted);
};

export { hash, compare };