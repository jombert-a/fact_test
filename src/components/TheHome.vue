<template>
  <main class="home">
    <template v-if="!isLoading">
      <div v-if="!isError" class="home__body">
        <section class="home__control-panel">
          <button @click="resetSelected">Сбросить состояние</button>
          <button @click="backState" :disabled="currentIndex === 0">Отмена</button>
          <button @click="forwardState" :disabled="isLastInQueue">Возврат</button>
        </section>
        <section>
          <template v-for="(arr, index) in sortedArray">
            {{typeof  arr[0]}}
            <multiselect
                         :options="arr"
                         :key="arr[0] + index"
                         :value="selected"
                         @select="newSelectedItem($event)"
                         @remove="removeSelectedItem($event)"
                         :close-on-select="false"
                         :multiple="true">
              <div slot="selection">{{countElements(typeof arr[0], selected)}}</div>
              <template slot="option" slot-scope="{option}">
                {{option === false ? 'false' : option}}
              </template>
            </multiselect>
          </template>
        </section>
        <section>
          <the-list :list="selected" />
        </section>
        <section v-if="hashStrings">
          <h3>SHA256 of Strings</h3>
          <p>{{hashStrings}}</p>
        </section>
        <section v-if="selectedNumbers.length > 0">
          <h3>Multiplied numbers</h3>
          <p>{{multipliedNumbers}}</p>
        </section>
      </div>
      <app-modal v-else :closable="false">
        <h4 slot="header">Возникла ошибка...</h4>
        <div slot="body">
          <p>{{errorText}}</p>
          <p>Попробуйте позже</p>
        </div>
      </app-modal>
    </template>
    <div v-else>
      Загрузка...
    </div>
  </main>
</template>

<script>
import AppModal from "@/components/common/AppModal";
import Multiselect from 'vue-multiselect'
import TheList from "@/components/TheList";
import { sha256 } from 'js-sha256';

export default {
  name: "TheHome",
  components: {TheList, AppModal, Multiselect},

  data() {
    return {
      isLoading: false,
      isError: false,
      errorText: '',
      testArr: [],
      selected: [],
      fixedState: [[]],
      currentIndex: 0
    }
  },

  computed: {
    cleanArray() {
      const flat = function (arr) {
        let res = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] instanceof Array)
            res.push(...flat(arr[i]))
          else
            res.push(arr[i])
        }
        return res
      }
      return flat(this.testArr)
    },

    sortedArray() {
      let nav = {}, count = 0, res = []
      const arr = this.cleanArray
      for (let i = 0; i < arr.length; i++) {
        let path = nav[typeof arr[i]]

        if (path === undefined) {
          nav[typeof arr[i]] = count++
          path = nav[typeof arr[i]]
        }

        if (arr[i] !== null) {
          if (!res[path])
            res.push([arr[i]])
          else
            res[path].push(arr[i])
        }
      }
      return res
    },

    hashStrings() {
      let string = ''
      for (let i = 0; i < this.selected.length; i++) {
        if (typeof this.selected[i] === 'string') string += this.selected[i]
      }
      return string ? sha256(string) : ''
    },

    selectedNumbers() {
      let res = []
      for (let i = 0; i < this.selected.length; i++) {
        let type = typeof this.selected[i]
        if (type === 'number' || type === 'bigint')
          res.push(this.selected[i])
      }
      return res
    },

    multipliedNumbers() {
      let res = 1
      for (let i = 0; i < this.selectedNumbers.length; i++) {
          res *= this.selectedNumbers[i]
      }
      return res
    },

    isLastInQueue() {
      return this.currentIndex === this.fixedState.length - 1
    }
  },
  methods: {
    countElements(type, arr) {
      let res = 0
      for (let i = 0; i < arr.length; i++) {
        res += typeof arr[i] === type ? 1 : 0
      }
      return `Выбрано ${res} элементов`
    },

    resetSelected() {
      this.selected = []
      this.fixedState = [[]]
      this.currentIndex = 0
    },

    newSelectedItem(data) {
      this.currentIndex += 1

      this.selected.push(data)

      if (this.fixedState.length >= 10) {
        this.fixedState.shift()
        this.currentIndex = 10
      }

      this.fixedState.push([...this.selected])

      if (this.currentIndex !== this.fixedState.length - 1) {
        let newArr = []
        for (let i = 0; i < this.currentIndex + 1; i ++) {
          newArr.push(this.fixedState[i])
        }
        this.fixedState = [...newArr]
      }
    },

    removeSelectedItem(data) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i] === data) {
          this.selected.splice(i, 1)
          break
        }
      }

      if (this.currentIndex !== this.fixedState.length - 1) {
        this.currentIndex -= 1
        let newArr = []
        for (let i = 0; i < this.currentIndex + 1; i++) {
          newArr.push(this.fixedState[i])
        }
        this.fixedState = [...newArr]
      }
      else {
        this.currentIndex += 1
        this.fixedState.push([...this.selected])
      }
    },

    backState() {
      this.currentIndex -= 1
      this.selected = [...this.fixedState[this.currentIndex]]
    },

    forwardState() {
      this.currentIndex += 1
      this.selected = [...this.fixedState[this.currentIndex]]
    }
  },

  async created() {
    this.isLoading = true
    try {
      let response = await fetch('https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json')
      let result = await response.json()
      this.testArr = result.testArr
    } catch (error) {
      this.isError = true
      this.errorText = error
    }
    this.isLoading = false
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">
  .home {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .home__body {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100px 1fr 1fr;
  }

  .home__control-panel {
    grid-column-start: span 2;
    border: 1px solid teal;
    padding: 30px;
    display: flex;
    justify-content: space-around;
  }
</style>
