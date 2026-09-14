# Website transfer and editing guide / 网页迁移与修改说明

## Recommended workflow / 推荐方式

On the other computer, install Git and sign in to GitHub, then clone the website repository:

```powershell
git clone https://github.com/XuanHeFan/XuanHeFan.github.io.git
cd XuanHeFan.github.io
```

Open the cloned `XuanHeFan.github.io` folder in Codex. You can then describe the changes you want in natural language.

在另一台电脑上安装 Git 并登录 GitHub，然后执行以上命令克隆网页仓库。把克隆得到的 `XuanHeFan.github.io` 文件夹作为项目文件夹在 Codex 中打开，即可继续用自然语言修改网页。

## Publishing changes / 发布修改

After reviewing the local result, publish with:

```powershell
git add .
git commit -m "Update homepage"
git push origin main
```

GitHub Pages normally updates automatically after the push. The first push from a new computer may ask you to sign in to GitHub.

检查本地效果后，执行以上命令发布。推送完成后 GitHub Pages 通常会自动更新；新电脑首次推送时可能会要求登录 GitHub。

## Language files / 语言文件

- English (default): `contents/config.yml` and `contents/*.md`
- Chinese: `contents/config.zh.yml` and `contents/*.zh.md`
- Language switch logic: `static/js/scripts.js`
- Navigation and page structure: `index.html`
- Custom layout and styles: `static/css/main.css`

This ZIP is a source backup without Git history or account credentials. For future publishing, cloning the GitHub repository as described above is the simplest approach.

本压缩包是源码备份，不包含 Git 历史与账号凭据。若需要继续发布，推荐按上面的方式从 GitHub 克隆仓库。
