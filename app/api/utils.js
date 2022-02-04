import {nanoid} from "nanoid";
import * as mime from 'react-native-mime-types';
import _ from 'lodash';

export const mapOrder = (order, key) => (a, b) => order.indexOf(a[key]) > order.indexOf(b[key]) ? 1 : -1;

export const getFileExtension = (uri) => uri.substring(uri.lastIndexOf('.') + 1, uri.length) || uri;

export const getFileFromURI = (uri) => {
  if (!_.isString(uri)) throw new DOMException("File uri must be string.");
  const name = nanoid() + '.' + getFileExtension(uri);
  const type = mime.lookup(name)
  return {name, type, uri}
}