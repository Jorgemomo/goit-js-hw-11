'use strict';
import { fetchImage } from './fetchImage';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  buttonLoadMore: document.querySelector('.load-more'),
};

let searchQuery = '';
let page = 1;
let hits = 0;

let simpleLightbox = new SimpleLightbox('.gallery a ', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

function buttonHidden() {
  ref.buttonLoadMore.classList.add('hidden');
}
function buttonShow() {
  ref.buttonLoadMore.classList.remove('hidden');
}

function cleanSearch() {
  ref.gallery.innerHTML = '';
}

function loadGallery(hits) {
  const markup = hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}" rel="noopener noreferrer">
    
      <img class=gallery__image"" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
      </a>
    </div>`;
    })
    .join('');

  ref.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightbox.refresh();
}

async function search(event) {
  event.preventDefault();
  cleanSearch();
  buttonHidden();

  try {
    searchQuery = event.currentTarget.searchQuery.value;
    page = 1;

    if (searchQuery === '') {
      return;
    }

    const response = await fetchImage(searchQuery, page);
    hits = response.hits.length;

    if (response.totalHits > 40) {
      buttonShow();
    } else {
      buttonHidden();
    }

    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

      cleanSearch();
      loadGallery(response.hits);
    }

    if (response.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      cleanSearch();
      buttonHidden();
    }
  } catch {
    console.error();
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * -50,
    behavior: 'smooth',
  });
}

async function loadMore() {
  page += 1;
  try {
    const response = await fetchImage(searchQuery, page);
    loadGallery(response.hits);

    hits += response.hits.length;
    if (hits === response.totalHits) {
      ref.buttonLoadMore.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

ref.searchForm.addEventListener('submit', search);
ref.buttonLoadMore.addEventListener('click', loadMore);
