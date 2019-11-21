<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      default: null
    }
  },
  watch: {
    chartData(val) {
      console.log(val);
    }
  },
  mounted() {
    this.renderChart(this.chartData);
  }
};
</script>
