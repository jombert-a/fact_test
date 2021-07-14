<template>
  <div class="modal">
      <div class="modal__container">
        <div class="modal__header">
          <slot name="header" />
        </div>
        <div class="modal__body">
          <slot name="body" />
        </div>
        <div class="modal__footer">
          <slot name="footer">
            <button v-if="closable" class="modal__button" @click="$emit('close')" tabindex="0">
              OK
            </button>
          </slot>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppModal",
  props: {
    closable: {type: Boolean, default: true}
  },
}
</script>

<style scoped lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal__container {
    background: #fff;
    border-radius: 6px;
    padding: 20px;
    min-width: 300px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
  }

  .modal__header {
    color: tomato;
  }

  .modal__body {
    margin: 16px 0;
  }

</style>