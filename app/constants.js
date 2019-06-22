export const API_URL = 'https://api.challenge-pik.webulla.ru';
export const API_TIMEOUT = 60000;

export const STORAGE_KEY = 'ChallengePikSite';
export const STORAGE_KEY_PRIMARY = 'id';
export const STORAGE_KEY_TOKEN = 'token';

export const HTTP_STATUS_VALIDATION_ERROR = 422;

export const PREVIEW_MAX_SIZE = 500;
export const IMAGE_MAX_SIZE = 1200;

export const URI_DEFAULT = '/';
export const URI_REGISTER = '/register';
export const URI_LOGIN = '/login';
export const URI_LOGOUT = '/logout';
export const URI_PROPERTY_INDEX = '/properties';
export const URI_PROPERTY_CREATE = '/properties/create';
export const URI_PROPERTY_UPDATE = '/properties/:id/update';
export const URI_PROPERTY_VIEW = '/properties/:id';
export const URI_PROPERTY_DELETE = '/properties/:id/delete';
export const URI_ROOM_INDEX = '/properties/:property/rooms';
export const URI_ROOM_CREATE = '/properties/:property/rooms/create';
export const URI_ROOM_UPDATE = '/properties/:property/rooms/:id/update';
export const URI_ROOM_VIEW = '/properties/:property/rooms/:id';
export const URI_ROOM_DELETE = '/properties/:property/rooms/:id/delete';

export const URI_API_LOGIN = '/muffin/auth/login';
export const URI_API_REGISTER = '/muffin/auth/register';
export const URI_API_PICTURES = '/muffin/picture';
export const URI_API_PICTURE = '/muffin/picture/:id';
export const URI_API_PROPERTIES = '/muffin/property';
export const URI_API_PROPERTIES_SEARCH = '/muffin/property/search';
export const URI_API_PROPERTY = '/muffin/property/:id';
export const URI_API_PROPERTY_PICTURES = '/muffin/property-picture';
export const URI_API_PROPERTY_PICTURES_SEARCH = '/muffin/property-picture/search';
export const URI_API_PROPERTY_PICTURE = '/muffin/property-picture/:id';
export const URI_API_ROOMS = '/muffin/property-room';
export const URI_API_ROOMS_SEARCH = '/muffin/property-room/search';
export const URI_API_ROOM = '/muffin/property-room/:id';
export const URI_API_ROOM_PICTURES = '/muffin/property-room-picture';
export const URI_API_ROOM_PICTURES_SEARCH = '/muffin/property-room-picture/search';
export const URI_API_ROOM_PICTURE = '/muffin/property-room-picture/:id';
