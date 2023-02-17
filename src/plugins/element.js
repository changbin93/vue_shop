
import {
  ElButton, ElForm, ElFormItem, ElInput, ElIcon,
  ElMessage, ElContainer, ElAside, ElHeader, ElMain, ElMenu,
  ElSubmenu, ElMenuItemGroup, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem,
  ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElSwitch, ElTooltip,
  ElPagination, ElDialog, ElMessageBox
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
  app.use(ElPagination).use(ElDialog).use(ElMessageBox)
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$messagebox = ElMessageBox
}
