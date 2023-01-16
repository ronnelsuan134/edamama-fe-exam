import { defineStore } from 'pinia';
import { useAxios } from '@vueuse/integrations/useAxios';


export interface Query {
  skip: number,
  take: number
}

const state = () => ({
  onprogress: false,
  percentage: 0,
  toast: false,
  products: null,
});

const getters = {}

const actions = {
  async getProducts(q: Query) {
    const config = useRuntimeConfig();
    const router = useRouter();

    const { data, error, response } = await useAxios(`/products?skip=${q.skip}&take=${q.take}`, {
      baseURL: config.baseApiUrl,
      method: 'GET',
    })
    return data.value.data
  },
  async onUploadProduct(productData: Object) {
    let per = 0;
    const config = useRuntimeConfig();
    const bar = document.getElementById('progress-bar')
    const percent = document.getElementById('percentage')
    let fd = new FormData();

    fd.append('photo', productData.file)

    fd.append('title', productData.title);
    fd.append('description', productData.description)
    fd.append('price', productData.price)
    fd.append('stock', productData.stock)
    this.onprogress = true

    const { data, error, response } = await useAxios(`/products`, {
      baseURL: config.baseApiUrl,
      method: 'POST',
      data: fd,
      onUploadProgress: function (progressEvent) {
        per = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        bar.style.backgroundColor = '#07A79F'
        bar.style.width = per + "%"
        percent.textContent = `${per}%`
      }
    })
    this.percentage = per;
    if (response.value && response.value.status == 201) {
      setTimeout(() => {
        this.onprogress = false
      }, 2000)
      return true
    }
  },
  async onEdit(editProduct: Object) {
    let per = 0;
    const config = useRuntimeConfig();
    const bar = document.getElementById('progress-bar')
    const percent = document.getElementById('percentage')
    let fd = new FormData();

    this.onprogress = true
    fd.append('photo', editProduct.file)

    fd.append('title', editProduct.title);
    fd.append('description', editProduct.description)
    fd.append('price', editProduct.price)
    fd.append('stock', editProduct.stock)

    const { data, error, response } = await useAxios(`/products/${editProduct.id}`, {
      baseURL: config.baseApiUrl,
      method: 'PUT',
      data: fd,
      onUploadProgress: function (progressEvent) {
        per = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        bar.style.backgroundColor = '#07A79F'
        bar.style.width = per + "%"
        percent.textContent = `${per}%`
      }
    })
    this.percentage = per;
    if (response.value && response.value.status == 200) {
      setTimeout(() => {
        this.onprogress = false
      }, 2000)
      return true
    }
  },
  async onDestroy(productId: String) {
    const config = useRuntimeConfig();

    const { data, error, response } = await useAxios(`/products/${productId}`, {
      baseURL: config.baseApiUrl,
      method: 'DELETE',
      data: { id: productId },
    })
    if (response.value && response.value.status == 200) {
      return true;
    }

  }
}

export const useProductStore = defineStore('productStore', {
  state,
  getters,
  actions,
  persistedState: {
    overwrite: true,
    excludePaths: []
  },
}); 