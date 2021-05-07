<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- 月選択 -->
        <v-col cols="12">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateRangeText"
                label="集計対象日"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                hide-details
              />
            </template>
            <v-date-picker
              v-model="dates"
              type="date"
              color="primary"
              locale="ja-jp"
              :day-format="(date) => new Date(date).getDate()"
              no-title
              scrollable
              range
            >
              <v-spacer />
              <v-btn text color="grey" @click="menu = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="onSelectDates">選択</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <!-- サマリー -->
        <v-col cols="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">日付</th>
                  <th class="text-right">作業時間</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="days in summaryData"
                  v-bind:summaryData="summaryData"
                  v-bind:key="days.date"
                >
                  <td>{{ days.date }}</td>
                  <td class="text-right">{{ days.workH }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <!-- 検索フォーム -->
        <v-col cols="12">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-col>
      </v-card-title>
      <!-- テーブル -->
      <v-data-table
        class="text-no-wrap"
        :headers="tableHeaders"
        :items="tableData"
        :search="search"
        :loading="loading"
        :sort-by="'category'"
        :sort-desc="true"
        :page.sync="page"
        :items-per-page="20"
        hide-default-footer
        @page-count="pageCount = $event"
        mobile-breakpoint="0"
      >
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="10"
          circle
        ></v-pagination>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",

  data() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);

    return {
      /** 対象日選択メニューの状態 */
      menu: false,
      /** 検索文字 */
      search: "",
      /** 選択年月 */
      dates: [`${year}-${month}-${day}`, `${year}-${month}-${day}`],
      /** テーブルに表示させるデータ */
      tableData: [],
      /** サマリーに表示させるデータ */
      summaryData: [],
      /** テーブルのページ番号 */
      page: 1,
      /** テーブルのページ番号の件数 */
      pageCount: 0,
    };
  },

  computed: {
    ...mapState({
      /** カレンダーデータ */
      calData: (state) => state.calData,
      /** ローディング状態 */
      loading: (state) => state.loading.fetch,
    }),

    /** 日付の範囲文字列設定 */
    dateRangeText() {
      return this.dates.join(" ～ ");
    },

    /** テーブルのヘッダー設定 */
    tableHeaders() {
      return [
        { text: "カテゴリ", value: "category" },
        { text: "内容", value: "content" },
        { text: "作業時間", value: "workH", align: "end" },
      ];
    },
  },

  methods: {
    ...mapActions([
      /** カレンダーデータを取得 */
      "fetchCalData",
    ]),

    /** 表示させるデータを更新します */
    async updateTable() {
      const dates = this.dates;

      const startDate = dates[0];
      const endDate = dates[1];

      const listKey = startDate + endDate;

      await this.fetchCalData({ startDate, endDate });
      this.summaryData = this.calData[listKey].day;
      this.tableData = this.calData[listKey].content;
    },

    /** 対象日付選択ボタンがクリックされたとき */
    onSelectDates() {
      this.$refs.menu.save(this.dates);
      this.updateTable();
    },
  },

  created() {
    this.updateTable();
  },
};
</script>