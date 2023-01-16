<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '~~/store/product';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
const productStore = useProductStore()
const displayModal = ref(false);
const products = ref();
const toast = useToast()
const confirm = useConfirm();
const method = ref('post')

const uploadData = reactive({
  id: null,
  file: null,
  title: '',
  description: '',
  price: null,
  stock: null
});

onMounted(async () => {
  await productStore.getProducts({ skip: 0, take: 10 }).then(data => products.value = data);
  // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Order submitted', life: 3000 })
})

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
};

const upload = async (e) => {
  const img: any = document.querySelector('#file');
  uploadData.file = img.files[0]
  const data = await productStore.onUploadProduct(uploadData);
  if (data) {
    setTimeout(() => displayModal.value = false, 1500)
    await productStore.getProducts({ skip: 0, take: 10 }).then(data => products.value = data);
    toast.add({ severity: 'success', summary: 'Success!', detail: 'Product Added', life: 3000 });
    clearData()
  }
}

const clearData = () => {
  uploadData.id = null
  uploadData.file = null
  uploadData.title = ''
  uploadData.description = ''
  uploadData.price = null
  uploadData.stock = null
}

const getProductData = (data) => {
  uploadData.id = data.id
  uploadData.title = data.title,
    uploadData.description = data.description,
    uploadData.price = data.price,
    uploadData.stock = data.stock

}

const onDelete = (id) => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const del = await productStore.onDestroy(id)
      if (del) {
        await productStore.getProducts({ skip: 0, take: 10 }).then(data => products.value = data)
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
}

const onEdit = (data) => {
  method.value = 'put'
  displayModal.value = true;
  getProductData(data)
}

const onUpdate = async (dt) => {
  const img: any = document.querySelector('#file');
  dt.file = img.files[0]
  const isEdited = await productStore.onEdit(dt);
  if (isEdited) {
    setTimeout(() => displayModal.value = false, 1500)
    await productStore.getProducts({ skip: 0, take: 10 }).then(data => products.value = data);
    toast.add({ severity: 'success', summary: 'Up to date!', detail: 'Product Updated', life: 3000 });
    clearData()
    method.value = 'post'
  }
}

const openModal = () => {
  displayModal.value = true;
}
const closeModal = () => {
  clearData()
  displayModal.value = false;

}

</script>
<template>
  <NuxtLayout name="home">
    <Toast />
    <ConfirmDialog />
    <div class="relative">
      <div class="flex items-center justify-end w-full mt-14">
        <div class="w-12 h-12 mr-12" @click="openModal">
          <Button icon="pi pi-plus" class=" p-button-rounded p-button-success" />
        </div>
      </div>
      <div>
        <DataTable :value="products" responsiveLayout="scroll">
          <template #header>
            <div class="table-header">
              <Button icon="pi pi-refresh" />
            </div>
          </template>
          <Column field="name" header="Name">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
          </Column>
          <Column header="Image">
            <template #body="slotProps">
              <img src="https://placeimg.com/300/300/any" :alt="slotProps.data.title" class="product-image" />
            </template>
          </Column>
          <Column header="Description">
            <template #body="slotProps">
              {{ slotProps.data.description }}
            </template>
          </Column>
          <Column field="price" header="Price">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>

          <Column field="stock" header="Stock">
            <template #body="slotProps">
              {{ slotProps.data.stock }}
            </template>
          </Column>

          <Column field="action" header="Action">
            <template #body="slotProps">
              <div class="flex">
                <div class="mx-1">
                  <Button icon="pi pi-times" class=" p-button-rounded p-button-danger"
                    @click="onDelete(slotProps.data.id)" />
                </div>
                <div class="mx-1">
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-info" @click="onEdit(slotProps.data)" />
                </div>
              </div>
            </template>
          </Column>

          <template #footer>
            In total there are {{ products? products.length : 0 }} products.
          </template>
        </DataTable>
      </div>
      <Dialog header="Product" v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        :style="{ width: '40vw' }" :modal="true">
        <form action="">
          <div class="flex flex-col items-center justify-center mx-auto my-2">
            <div class="w-[80%]">
              <label class="block">
                <span class="sr-only">Choose File</span>
                <input type="file" id="file"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </label>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center mx-auto my-2">
            <div class="w-[80%]">
              <p class="font-semibold">Title:</p>
              <InputText type="text" class="w-full rounded-md" v-model="uploadData.title" />
            </div>
          </div>

          <div class="flex flex-col items-center justify-center mx-auto my-2">
            <div class="w-[80%]">
              <p class="font-semibold">Description:</p>
              <Textarea :autoResize="true" rows="5" cols="30" class="w-full rounded-md"
                v-model="uploadData.description" />
            </div>
          </div>

          <div class="flex flex-col items-center justify-center mx-auto my-2">
            <div class="w-[80%]">
              <p class="font-semibold">Price:</p>
              <InputText type="text" class="w-full rounded-md" v-model="uploadData.price" />
            </div>
          </div>

          <div class="flex flex-col items-center justify-center mx-auto my-2">
            <div class="w-[80%]">
              <p class="font-semibold">Stock:</p>
              <InputText type="text" class="w-full rounded-md" v-model="uploadData.stock" />
            </div>
          </div>
          <div
            class="w-[80%]  flex flex-col items-center justify-center mx-auto my-2  bg-gray-200 rounded-full h-2.5 mb-2 "
            v-show="productStore.$state.onprogress">
            <div class="relative w-full h-3 rounded-full" id="progress-bar">
              <p id="percentage" class="mx-auto text-xs text-center text-white">0%</p>
            </div>
          </div>

        </form>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text" />
          <Button label="Yes" icon="pi pi-check" @click="upload" autofocus v-if="method == 'post'" />
          <Button label="Yes" icon="pi pi-pencil" @click="onUpdate(uploadData)" autofocus v-else />
        </template>
      </Dialog>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}

.p-progressbar-value {
  background-color: #f44336;
}
</style>   
