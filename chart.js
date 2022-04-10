import * as d3 from 'd3';
import { scaleBand } from 'd3';

const drawScatterSlot = async () => {
  const livingCostUrl =
    'https://gist.githubusercontent.com/S4mLab/6177659dfe9b46ba13b2e78767f51788/raw/22bbacf17e7bd978f6821fc5eed0c23c850507c9/living_cost_index_2022.csv';

  const livingIndexObjsList = await d3.csv(livingCostUrl);
  console.table(livingIndexObjsList[0]);
  // 1. ACCESS THE DATA
  /*
  what variables you want to see the coorelation
  cost of living and rent 
  see wether if rent has a strong coorelate with cost of living  
  */
  const xAccessor = (dataObj) => +dataObj['Rent Index'];
  const yAccessor = (dataObj) => +dataObj['Cost of Living Index'];
  const colorAccessor = (dataObj) => +dataObj['Groceries Index'];

  // 2. INITIALISE WRAPPER & CHART DIMENSIONS
  const minDimension = d3.min([
    window.innerHeight * 0.9,
    window.innerWidth * 0.9,
  ]);
  const wrapperDimension = {
    height: minDimension,
    width: minDimension,
    margins: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  const chartDimension = {
    width:
      wrapperDimension.width -
      wrapperDimension.margins.right -
      wrapperDimension.margins.left,
    height:
      wrapperDimension.height -
      wrapperDimension.margins.top -
      wrapperDimension.margins.bottom,
  };

  // 3. DRAW WRAPPER AND CHART ELEMENTS
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', wrapperDimension.width)
    .attr('height', wrapperDimension.height)
    .style('background-color', 'e9ecef');

  const chart = wrapper
    .append('g')
    .attr('width', chartDimension.width)
    .attr('height', chartDimension.height)
    .style(
      'transform',
      `translate(${wrapperDimension.margins.left}px, ${wrapperDimension.margins.top}px)`
    );

  // 4. CREATE THE SCALES
  const maxRentIndex = d3.max(livingIndexObjsList, xAccessor);
  const rentDomain = [0, maxRentIndex];
  const xScale = d3
    .scaleLinear()
    .domain(rentDomain)
    .range([0, chartDimension.width])
    .nice();

  const maxLivingCostIndex = d3.max(livingIndexObjsList, yAccessor);
  const livingCostDomain = [0, maxLivingCostIndex];
  const yScale = d3
    .scaleLinear()
    .domain(livingCostDomain)
    .range([chartDimension.height, 0])
    .nice();

  const groceriesDomain = d3.extent(livingIndexObjsList, colorAccessor);
  const colorScale = d3
    .scaleLinear()
    .domain(groceriesDomain)
    .range(['skyblue', 'darkslategrey']);

  // 5. DRAW THE DATA ELEMENT
  const dataDots = chart.selectAll('circle').data(livingIndexObjsList);

  dataDots
    .join('circle')
    .attr('cx', (dataObj) => xScale(xAccessor(dataObj)))
    .attr('cy', (dataObj) => yScale(yAccessor(dataObj)))
    .attr('r', 3)
    .attr('fill', (dataObj) => colorScale(colorAccessor(dataObj)));

  // 6. INITIALISE THE PERIPHERALS (AXES, LABELS, LEGENDS,...)
  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = chart
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${chartDimension.height}px)`);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = chart.append('g').call(yAxisGenerator);

  const xAxisLabel = xAxis
    .append('text')
    .attr('x', chartDimension.width / 2)
    .attr('y', wrapperDimension.margins.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Rent Index');

  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -chartDimension.height / 2)
    .attr('y', -wrapperDimension.margins.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Living Cost Index')
    .style('text-anchor', 'middle')
    .style('transform', `rotate(-90deg)`);
  // 7. DRAW THE PERIPHERALS
};

drawScatterSlot();
