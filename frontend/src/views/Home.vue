<template>
  <div class="home">
    <!-- URL 输入区域 -->
    <el-card class="url-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Link /></el-icon>
          <span>网页URL</span>
        </div>
      </template>
      <el-input
        v-model="url"
        placeholder="请输入要采集的网页URL（例如：https://example.com）"
        size="large"
        clearable
      >
        <template #append>
          <el-button type="primary" @click="handlePreview" :loading="previewLoading">
            预览
          </el-button>
        </template>
      </el-input>
    </el-card>

    <!-- 选择器配置 -->
    <el-card class="selector-card" shadow="hover" v-if="url">
      <template #header>
        <div class="card-header">
          <el-icon><SetUp /></el-icon>
          <span>采集规则配置</span>
          <el-button
            class="add-btn"
            type="primary"
            size="small"
            @click="addSelector"
          >
            <el-icon><Plus /></el-icon>
            添加规则
          </el-button>
        </div>
      </template>

      <div class="selector-list">
        <div
          v-for="(selector, index) in selectors"
          :key="index"
          class="selector-item"
        >
          <el-input
            v-model="selector.key"
            placeholder="数据名称（如：title）"
            class="key-input"
          />
          <el-input
            v-model="selector.selector"
            placeholder="CSS选择器（如：h1）"
            class="selector-input"
          />
          <el-button
            type="danger"
            :icon="Delete"
            @click="removeSelector(index)"
            circle
          />
        </div>
      </div>

      <el-button
        type="success"
        size="large"
        class="scrape-btn"
        @click="handleScrape"
        :loading="scraping"
        :disabled="selectors.length === 0"
      >
        <el-icon><VideoPlay /></el-icon>
        开始采集
      </el-button>
    </el-card>

    <!-- 结果展示 -->
    <el-card class="result-card" shadow="hover" v-if="result">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>采集结果</span>
          <el-button
            type="text"
            @click="copyResult"
          >
            复制结果
          </el-button>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item
          v-for="(value, key) in result.data"
          :key="key"
          :label="key"
        >
          <div v-if="Array.isArray(value)">
            <el-tag
              v-for="(item, idx) in value"
              :key="idx"
              class="data-tag"
            >
              {{ item }}
            </el-tag>
          </div>
          <span v-else>{{ value || '未找到' }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Link,
  SetUp,
  Plus,
  Delete,
  VideoPlay,
  DataAnalysis
} from '@element-plus/icons-vue';
import axios from 'axios';
import type { ScrapeSelector, ScrapeResult } from '@/types';

const url = ref('');
const selectors = ref<ScrapeSelector[]>([
  { key: 'title', selector: 'title' },
  { key: 'description', selector: 'meta[name="description"]' }
]);
const previewLoading = ref(false);
const scraping = ref(false);
const result = ref<ScrapeResult | null>(null);

const addSelector = () => {
  selectors.value.push({ key: '', selector: '' });
};

const removeSelector = (index: number) => {
  selectors.value.splice(index, 1);
};

const handlePreview = async () => {
  if (!url.value) {
    ElMessage.warning('请输入URL');
    return;
  }

  previewLoading.value = true;
  try {
    const response = await axios.get('/api/scrape/preview', {
      params: { url: url.value }
    });
    if (response.data.success) {
      ElMessage.success('预览成功');
      // 自动填充一些选择器
      if (response.data.data.title) {
        selectors.value[0].selector = 'title';
      }
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.error || '预览失败');
  } finally {
    previewLoading.value = false;
  }
};

const handleScrape = async () => {
  if (selectors.value.length === 0) {
    ElMessage.warning('请添加至少一个采集规则');
    return;
  }

  const selectorsObj: Record<string, string> = {};
  selectors.value.forEach(s => {
    if (s.key && s.selector) {
      selectorsObj[s.key] = s.selector;
    }
  });

  scraping.value = true;
  try {
    const response = await axios.post('/api/scrape', {
      url: url.value,
      selectors: selectorsObj
    });
    if (response.data.success) {
      result.value = response.data.data;
      ElMessage.success('采集成功！');
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.error || '采集失败');
  } finally {
    scraping.value = false;
  }
};

const copyResult = () => {
  if (result.value) {
    navigator.clipboard.writeText(JSON.stringify(result.value, null, 2));
    ElMessage.success('结果已复制到剪贴板');
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.url-card,
.selector-card,
.result-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.add-btn {
  margin-left: auto;
}

.selector-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.key-input {
  flex: 1;
}

.selector-input {
  flex: 2;
}

.scrape-btn {
  width: 100%;
  margin-top: 20px;
}

.data-tag {
  margin: 2px;
}

.el-descriptions {
  margin-top: 20px;
}
</style>
