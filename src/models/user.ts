export type UserDTO = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name?: string;
  avatar?: string;
  phone: string;
  email: string;
};

export type User = {
  id: number;
  login: string;
  firstName: string;
  secondName: string;
  displayName?: string | undefined;
  avatar?: string | undefined;
  phone: string;
  email: string;
};

export type UserId = {
  id: number,
};

export function transformUserDTO(userDTO: UserDTO): User {
  return {
    id: userDTO.id,
    login: userDTO.login,
    firstName: userDTO.first_name,
    secondName: userDTO.second_name,
    displayName: userDTO.display_name,
    avatar: userDTO.avatar,
    phone: userDTO.phone,
    email: userDTO.email,
  };
}

export type UserFormData = {
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  email: string;
};

export function transformUserToUserData(user: User): UserFormData {
  return {
    login: user.login,
    first_name: user.firstName,
    second_name: user.secondName,
    display_name: user.displayName || '',
    phone: user.phone,
    email: user.email,
  };
}
