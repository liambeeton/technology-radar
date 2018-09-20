import _ from 'lodash';
import FusionCharts from 'fusioncharts/core';
import MultiLevelPie from 'fusioncharts/viz/multilevelpie';
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion'

FusionCharts.addDep(MultiLevelPie);
FusionCharts.addDep(FusionTheme);

function getChartObjects(array) {
    var entry = getEntryObject();

    for (var i = 0; i < array.length - 1; i++) {
        var categoryExists = objectFindByKey(entry.category, 'label', array[i].gsx$category.$t);

        if (categoryExists) {
            var stageExists = objectFindByKey(categoryExists.category, 'label', array[i].gsx$stage.$t);

            if (stageExists) {
                var nameExists = objectFindByKey(stageExists.category, 'label', array[i].gsx$name.$t);

                if (!nameExists) {
                    var name = getNameObject(array[i].gsx$name.$t, array[i].gsx$stage.$t);

                    stageExists.category.push(name);

                    categoryExists.category[stageExists.label] = stageExists;
                }
            } else {
                var name = getNameObject(array[i].gsx$name.$t, array[i].gsx$stage.$t);
                var stage = getStageObject(array[i].gsx$stage.$t);

                stage.category.push(name);
                categoryExists.category.push(stage);

                entry.category[categoryExists.label] = categoryExists;
            }
        } else {
            var name = getNameObject(array[i].gsx$name.$t, array[i].gsx$stage.$t);
            var stage = getStageObject(array[i].gsx$stage.$t);
            var category = getCategoryObject(array[i].gsx$category.$t);

            stage.category.push(name);
            category.category.push(stage);
            entry.category.push(category);
        }
    }

    var map = getMapObject();
    map.chart = getChartObject();
    map.category.push(entry);

    return map;
}

function getMapObject() {
    var map = {};
    map.chart = {};
    map.category = [];

    return map;
}

function getEntryObject() {
    var entry = {};
    entry.id = 0;
    entry.label = 'Categories';
    entry.color = '#89a2ad';
    entry.value = '150';
    entry.category = [];

    return entry;
}

function getChartObject() {
    var chart = {};
    chart.exportEnabled = 1;
    chart.caption = 'Bigbaobab Technology Radar';
    chart.subCaption = 'September 2018';
    chart.captionFontSize = '18';
    chart.subcaptionFontSize = '14';
    chart.hoverFillColor = '#89a2ad';
    chart.baseFont = 'Helvetica Neue,Arial';
    chart.baseFontSize = '12';
    chart.baseFontColor = '#333333';
    chart.valueFontColor = '#fffffff';

    return chart;
}

function getNameObject(text, stage) {
    var name = {};
    name.label = text;

    if (stage === 'Adopt') {
        name.color = '#00263E';
    } else if (stage === 'Trial') {
        name.color = '#003f66';
    } else if (stage === 'Assess') {
        name.color = '#005e99';
    } else if (stage === 'On Hold') {
        name.color = '#007dcc';
    }

    return name;
}

function getStageObject(text) {
    var stage = {};
    stage.label = text;

    if (text === 'Adopt') {
        stage.color = '#b3b3b3';
    } else if (text === 'Trial') {
        stage.color = '#808080';
    } else if (text === 'Assess') {
        stage.color = '#4d4d4d';
    } else if (text === 'On Hold') {
        stage.color = '#1a1a1a';
    }

    stage.value = '11.1';
    stage.category = [];

    return stage;
}

function getCategoryObject(text) {
    var category = {};
    category.label = text;
    category.color = '#b29430';
    category.value = '55.5';
    category.category = [];

    return category;
}

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }

    return null;
}

function renderChart(data) {
    var chartObjects = {};
    var chartDataSource = {};

    chartObjects = getChartObjects(data.feed.entry);
    chartDataSource = JSON.stringify(chartObjects);

    var chartInstance = new FusionCharts({
        type: 'multilevelpie',
        width: '900',
        height: '900',
        dataFormat: 'json',
        renderAt: 'chart-container',
        dataSource: chartDataSource
    });

    chartInstance.render();
}

function component() {
    let element = document.createElement('div');

    element.id = 'chart-container';
    element.innerHTML = _.join(['FusionCharts XT', 'will load here!'], ' ');

    return element;
}

document.body.appendChild(component());

var url = 'https://spreadsheets.google.com/feeds/list/1U0bWhRq48_32MkKt-tE69ncAfWX8ZYHeYO08I66yKQg/od6/public/values?alt=json';

fetch(url).then(r => r.json()).then(d => renderChart(d)).catch(e => console.log(e));