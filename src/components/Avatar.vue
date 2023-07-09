<script setup>
import { ref, toRefs, watch } from 'vue'
import { supabase } from '../supabase'
import MainButton from "@/components/buttons/MainButton.vue";

const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    console.log(filePath, 'atAvatar')

    let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

    if (uploadError) throw uploadError
    emit('update:path', filePath)
    emit('upload')
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

watch(path, () => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div>
    <img
        v-if="src"
        :src="src"
        alt="Avatar"
        class="avatar image img"
        :style="{ height: size + 'em', width: size + 'em' }"
    />
    <div v-else class="avatar no-image"/>

    <div>
      <MainButton class="rounded-full relative bottom-10 left-16">
        <div class="custom_content">
          <label class="button primary block" for="single">
            <i v-if="!uploading" class="pi pi-upload"/>
            <i v-else class="pi pi-spinner pi-spin" />
          </label>
          <input
              style="visibility: hidden; position: absolute"
              type="file"
              id="single"
              accept="image/*"
              @change="uploadAvatar"
              :disabled="uploading"
          />
        </div>
      </MainButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img {
  width: 150px;
  height: 150px;
  border-radius: 150px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 0 15px 10px $primary;
}
</style>