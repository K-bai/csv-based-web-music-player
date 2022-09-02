<template>
  <div class="c-pagination">
    <div class="pagination-item pagination-total">
      {{ (n_page - 1) * n_per_page + 1 }}-{{
        Math.min(n_page * n_per_page, total)
      }}
      共{{ total }}首
    </div>
    <div class="pagination-item pagination-per-page-label">每页数量:</div>
    <select
      class="pagination-item pagination-per-page-select"
      v-model="n_per_page"
      v-on:change="change_per_page"
    >
      <option
        v-for="option in per_page_option"
        v-bind:value="option.value"
        v-bind:key="option.text"
      >
        {{ option.text }}
      </option>
    </select>
    <div class="pagination-item c-pagination-go">
      <div
        class="pagination-go-first pagination-go-button"
        v-on:click="change_page(1)"
      >
        <div></div>
      </div>
      <div
        class="pagination-go-left pagination-go-button"
        v-on:click="add_page(-1)"
      >
        <div></div>
      </div>
      <input
        class="pagination-current-page"
        v-model="input_page"
        v-on:change="check_page"
        v-on:keydown.enter="$event.target.blur()"
      />
      <div
        class="pagination-go-right pagination-go-button"
        v-on:click="add_page(1)"
      >
        <div></div>
      </div>
      <div
        class="pagination-go-last pagination-go-button"
        v-on:click="to_last_page"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongListPagination",
  data() {
    return {
      n_page: this.page,
      n_per_page: this.per_page,
      per_page_option: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "全部", value: 999999 },
      ],
      input_page: 1,
    };
  },
  props: ["total", "page", "per_page"],
  methods: {
    check_page() {
      let p = parseInt(this.input_page);
      if (p >= 1 && p <= Math.ceil(this.total / this.n_per_page))
        this.change_page(p);
      else this.input_page = this.n_page;
    },
    add_page(p) {
      let to_page = this.n_page + p;
      if (to_page >= 1 && to_page <= Math.ceil(this.total / this.n_per_page))
        this.change_page(to_page);
    },
    to_last_page() {
      this.change_page(Math.ceil(this.total / this.n_per_page));
    },
    change_page(p) {
      this.input_page = p;
      this.n_page = p;
      this.$emit("update:page", p);
    },
    change_per_page() {
      // 换每页数量的时候回到第一页
      this.change_page(1);
      this.$emit("update:per_page", this.n_per_page);
    },
  },
  watch: {
    page() {
      this.input_page = this.page;
      this.n_page = this.page;
    },
  },
};
</script>

<style scoped>
.c-pagination {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid rgb(224, 224, 224);
  border-left: 1px solid rgb(224, 224, 224);
  border-right: 1px solid rgb(224, 224, 224);
  font-size: 0.9rem;
}
.pagination-item {
  margin-top: 0.5rem;
}
.pagination-per-page-select {
  padding: 0.2rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.pagination-total {
  padding: 0rem 1rem 0rem 0.5rem;
  color: rgb(48, 48, 48);
}
.c-pagination-go {
  display: flex;
  align-items: center;
}
.pagination-go-button {
  height: 2rem;
  width: 2rem;
  border-radius: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pagination-go-button:active {
  background-color: rgba(0, 0, 0, 0.2);
}
@media (any-hover: hover) {
  .pagination-go-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.pagination-go-button div {
  height: 1rem;
  width: 1rem;
  background-size: contain;
}
.pagination-go-first div {
  background-image: url("@/assets/ui/chevron-double-left.svg");
}
.pagination-go-left div {
  background-image: url("@/assets/ui/chevron-left.svg");
}
.pagination-current-page {
  min-width: 1rem;
  max-width: 3rem;
  padding: 0.2rem 0rem 0.2rem 0rem;
  border: 0px;
  text-align: center;
}
.pagination-go-right div {
  background-image: url("@/assets/ui/chevron-right.svg");
}
.pagination-go-last div {
  background-image: url("@/assets/ui/chevron-double-right.svg");
}

@media all and (max-width: 799px) {
  .c-pagination {
    justify-content: center;
  }
}
</style>
