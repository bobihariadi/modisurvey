import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./pages/news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then((m) => m.AccountPageModule),
  },
  {
    path: 'mulai',
    loadChildren: () =>
      import('./pages/mulai/mulai.module').then((m) => m.MulaiPageModule),
  },
  {
    path: 'capai',
    loadChildren: () =>
      import('./pages/capai/capai.module').then((m) => m.CapaiPageModule),
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./pages/upload/upload.module').then((m) => m.UploadPageModule),
  },
  {
    path: 'beritaharian',
    loadChildren: () =>
      import('./pages/modals/beritaharian/beritaharian.module').then(
        (m) => m.BeritaharianPageModule
      ),
  },
  {
    path: 'periksarute',
    loadChildren: () =>
      import('./pages/submulai/periksarute/periksarute.module').then(
        (m) => m.PeriksarutePageModule
      ),
  },
  {
    path: 'awalrute',
    loadChildren: () =>
      import('./pages/submulai/awalrute/awalrute.module').then(
        (m) => m.AwalrutePageModule
      ),
  },
  {
    path: 'kunjungan',
    loadChildren: () =>
      import('./pages/submulai/kunjungan/kunjungan.module').then(
        (m) => m.KunjunganPageModule
      ),
  },
  {
    path: 'akhirrute',
    loadChildren: () =>
      import('./pages/submulai/akhirrute/akhirrute.module').then(
        (m) => m.AkhirrutePageModule
      ),
  },
  {
    path: 'dalamrute',
    loadChildren: () =>
      import('./pages/subkunjungan/dalamrute/dalamrute.module').then(
        (m) => m.DalamrutePageModule
      ),
  },
  {
    path: 'luarrute',
    loadChildren: () =>
      import('./pages/subkunjungan/luarrute/luarrute.module').then(
        (m) => m.LuarrutePageModule
      ),
  },
  {
    path: 'pendingupload',
    loadChildren: () =>
      import('./pages/subkunjungan/pendingupload/pendingupload.module').then(
        (m) => m.PendinguploadPageModule
      ),
  },
  {
    path: 'editpelanggan',
    loadChildren: () =>
      import('./pages/form/editpelanggan/editpelanggan.module').then(
        (m) => m.EditpelangganPageModule
      ),
  },
  {
    path: 'listmenu',
    loadChildren: () =>
      import('./pages/subdalamrute/listmenu/listmenu.module').then(
        (m) => m.ListmenuPageModule
      ),
  },
  {
    path: 'availability',
    loadChildren: () =>
      import('./pages/subdalamrute/availability/availability.module').then(
        (m) => m.AvailabilityPageModule
      ),
  },
  {
    path: 'visibility',
    loadChildren: () =>
      import('./pages/subdalamrute/visibility/visibility.module').then(
        (m) => m.VisibilityPageModule
      ),
  },
  {
    path: 'survey',
    loadChildren: () =>
      import('./pages/subdalamrute/survey/survey.module').then(
        (m) => m.SurveyPageModule
      ),
  },
  {
    path: 'startvisit',
    loadChildren: () =>
      import('./pages/subdalamrute/startvisit/startvisit.module').then(
        (m) => m.StartvisitPageModule
      ),
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'itenary',
    loadChildren: () => import('./pages/itenary/itenary.module').then( m => m.ItenaryPageModule)
  },
  {
    path: 'routevisit',
    loadChildren: () => import('./pages/routevisit/routevisit.module').then( m => m.RoutevisitPageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./pages/maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'myoutlet',
    loadChildren: () => import('./pages/myoutlet/myoutlet.module').then( m => m.MyoutletPageModule)
  },
  {
    path: 'newoutlet',
    loadChildren: () => import('./pages/form/newoutlet/newoutlet.module').then( m => m.NewoutletPageModule)
  },
  {
    path: 'performance',
    loadChildren: () => import('./pages/performance/performance.module').then( m => m.PerformancePageModule)
  },
  {
    path: 'preview',
    loadChildren: () => import('./pages/preview/preview.module').then( m => m.PreviewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
