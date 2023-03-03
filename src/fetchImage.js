'use strict';
import axios from 'axios';

export async function fetchImage(searchQuery, page) {
  const key = '33855338-27803738c9487be1d7de18644';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return response.data;
}
