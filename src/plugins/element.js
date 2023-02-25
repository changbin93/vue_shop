
import {
  ElButton, ElForm, ElFormItem, ElInput, ElIcon,
  ElMessage, ElContainer, ElAside, ElHeader, ElMain, ElMenu,
  ElSubmenu, ElMenuItemGroup, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem,
  ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElSwitch, ElTooltip,
  ElPagination, ElDialog, ElMessageBox, ElTag, ElTree, ElSelect, ElOption,
  ElCascader,ElAlert,ElTabs,ElTabPane,ElSteps,ElStep,ElCheckboxGroup,ElCheckbox,
  ElUpload
} from 'element-plus'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElIcon)
  app.use(ElContainer)
  app.use(ElAside)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElMenu).use(ElSubmenu).use(ElMenuItemGroup).use(ElMenuItem)
  app.use(ElBreadcrumb).use(ElBreadcrumbItem).use(ElCard).use(ElRow).use(ElCol)
  app.use(ElTable).use(ElTableColumn).use(ElSwitch).use(ElTooltip)
  app.use(ElPagination).use(ElDialog).use(ElMessageBox).use(ElTag).use(ElTree)
  app.use(ElSelect).use(ElOption).use(ElCascader).use(ElAlert).use(ElTabs).use(ElTabPane)
  app.use(ElSteps).use(ElStep).use(ElCheckboxGroup).use(ElCheckbox).use(ElUpload)
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$messagebox = ElMessageBox
}
